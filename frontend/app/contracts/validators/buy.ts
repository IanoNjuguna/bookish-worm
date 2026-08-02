import {
	Blockfrost,
	Data,
	Lucid,
	fromText,
	toUnit,
	Constr,
	mintingPolicyToId,
	applyParamsToScript,
	applyDoubleCborEncoding,
	paymentCredentialOf,
	validatorToAddress,
	getAddressDetails,
} from "npm:@lucid-evolution/lucid@0.5.5";
import type { SpendingValidator, MintingPolicy, UTxO } from "npm:@lucid-evolution/lucid@0.5.5";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const env = await load({ envPath: "../.env" });
const BLOCKFROST = env["NEXT_PUBLIC_BLOCKFROST_PROJECT_ID"];
const TREASURY_ADDRESS = env["TREASURY_ADDRESS"] || Deno.env.get("TREASURY_ADDRESS") || "";
const FEE_BPS = 500n; // 5%

if (!TREASURY_ADDRESS) {
	console.warn("⚠️  TREASURY_ADDRESS is not set in .env — treasury fee output will be skipped.");
}

// Monkey-patch fetch to fix Blockfrost Conway era missing key_deposit bug in lucid-evolution
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: string | Request | URL, init?: RequestInit) => {
  const response = await originalFetch(input, init);
  const urlStr = typeof input === "string" ? input : (input instanceof URL ? input.toString() : input.url);
  if (urlStr.endsWith("/epochs/latest/parameters")) {
    const json = await response.clone().json();
    if (json && !json.key_deposit) {
      json.key_deposit = "6000000"; // 6 ADA
      return new Response(JSON.stringify(json), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
  }
  return response;
};

const lucid = await Lucid(
	new Blockfrost(
		"https://cardano-preprod.blockfrost.io/api/v0",
		BLOCKFROST,
	),
	"Preprod",
);

// Select beneficiary's wallet (the buyer)
lucid.selectWallet.fromPrivateKey(await Deno.readTextFile("./beneficiary.sk"));

const ownerPKH = paymentCredentialOf((await Deno.readTextFile("owner.addr")).trim()).hash;
const mint = await readMintValidator();
const mintCS = mintingPolicyToId(mint);
const distro = await readDistroValidator();

function encodeAddress(addressStr: string) {
	const { paymentCredential, stakeCredential } = getAddressDetails(addressStr);
	if (!paymentCredential) throw new Error("Invalid address: " + addressStr);

	const payCredPlutus = new Constr(paymentCredential.type === "Key" ? 0 : 1, [paymentCredential.hash]);

	let stakeCredPlutus;
	if (stakeCredential) {
		const stakeInline = new Constr(0, [
			new Constr(stakeCredential.type === "Key" ? 0 : 1, [stakeCredential.hash])
		]);
		stakeCredPlutus = new Constr(0, [stakeInline]);
	} else {
		stakeCredPlutus = new Constr(1, []); // None
	}

	return new Constr(0, [payCredPlutus, stakeCredPlutus]);
}

async function readDistroValidator(): Promise<SpendingValidator> {
	const blueprint = JSON.parse(await Deno.readTextFile("plutus.json"));
	const validator = blueprint.validators.find((v: any) => v.title === "frac.distribution.spend");
	const treasuryAddressStr = TREASURY_ADDRESS || (await Deno.readTextFile("owner.addr")).trim();
	const treasuryPlutusAddress = encodeAddress(treasuryAddressStr);

	return {
		type: "PlutusV3",
		script: applyParamsToScript(applyDoubleCborEncoding(validator.compiledCode), [
			ownerPKH,
			treasuryPlutusAddress,
			FEE_BPS,
		]),
	};
}

async function readMintValidator(): Promise<MintingPolicy> {
	const blueprint = JSON.parse(await Deno.readTextFile("plutus.json"));
	const validator = blueprint.validators.find((v: any) => v.title === "frac.fraction_minting.mint");
	return {
		type: "PlutusV3",
		script: applyParamsToScript(applyDoubleCborEncoding(validator.compiledCode), [ownerPKH]),
	};
}

const beneficiaryAddress = (await Deno.readTextFile("./beneficiary.addr")).trim();
const dAddress = validatorToAddress("Preprod", distro);

const tokenName = fromText("FTOIC01");
const unit = toUnit(mintCS, tokenName, 444);

// Redeemer: action=1 (Buy)
const redeemer = Data.to(new Constr(0, [1n, 0n]));

// DisDatum now carries price_lovelace (e.g. 5 ADA = 5_000_000 lovelace)
// This must match the price set when the distribution UTXO was created.
const PRICE_LOVELACE = 5_000_000n;
const dDatum = Data.to(new Constr(0, [PRICE_LOVELACE]));

try {
	const utxos: UTxO[] = await lucid.utxosAtWithUnit(dAddress, unit);
	if (utxos.length === 0) {
		throw new Error("No UTxOs found with the fractional token at the distribution address.");
	}
	const utxo: UTxO = utxos[0];
	const value = utxo.assets[unit];
	const outValue = value - 1n;

	console.log(`Current contract token balance: ${value}`);

	// Treasury fee: 1% of price
	const fee = PRICE_LOVELACE * FEE_BPS / 10000n;
	const creatorAddress = (await Deno.readTextFile("owner.addr")).trim();
	const creatorPayment = PRICE_LOVELACE - fee;

	let tx = lucid
		.newTx()
		.collectFrom([utxo], redeemer)
		.attach.SpendingValidator(distro)
		.pay.ToAddress(beneficiaryAddress, { [unit]: 1n })
		.pay.ToAddress(creatorAddress, { lovelace: creatorPayment })
		.pay.ToContract(dAddress, { kind: "inline", value: dDatum }, { [unit]: outValue });

	// Add treasury fee output if address is configured
	if (TREASURY_ADDRESS && fee > 0n) {
		tx = tx.pay.ToAddress(TREASURY_ADDRESS, { lovelace: fee });
	}

	const builtTx = await tx.complete();
	const signedTx = await builtTx.sign.withWallet().complete();
	const txHash = await signedTx.submit();

	console.log(`✅ Successfully claimed 1 token as buyer!
	    Tx Hash: ${txHash}
	    Treasury fee paid: ${fee} lovelace
	`);
} catch (error: unknown) {
	console.error("❌ Error during claim:", error);
}
