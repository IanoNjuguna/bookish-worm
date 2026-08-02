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
	getAddressDetails
} from "npm:@lucid-evolution/lucid@0.5.5";
import type { SpendingValidator, MintingPolicy, UTxO } from "npm:@lucid-evolution/lucid@0.5.5";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

// deno run --allow-net --allow-read --allow-env lucidInit.ts

// check the order of your validators in the './plutus.json' file 
// after you have built the project

const env = await load({ envPath: "../.env" });
const BLOCKFROST = env["NEXT_PUBLIC_BLOCKFROST_PROJECT_ID"];
const TREASURY_ADDRESS = env["TREASURY_ADDRESS"] || Deno.env.get("TREASURY_ADDRESS") || "";
const FEE_BPS = 500n; // 5%

// Monkey-patch fetch to fix Blockfrost Conway era missing key_deposit bug in lucid-evolution
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: string | Request | URL, init?: RequestInit) => {
  const response = await originalFetch(input, init);
  const urlStr = typeof input === "string" ? input : (input instanceof URL ? input.toString() : input.url);
  if (urlStr.endsWith("/epochs/latest/parameters")) {
    const json = await response.clone().json();
    if (json && !json.key_deposit) {
      json.key_deposit = "2000000"; // 2 ADA
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

lucid.selectWallet.fromPrivateKey(await Deno.readTextFile("./owner.sk"));
// lucid.selectWallet.fromPrivateKey(await Deno.readTextFile("./beneficiary.sk"));

const ownerPKH = paymentCredentialOf((await Deno.readTextFile("owner.addr")).trim()).hash;

const mint = await readMintValidator()
const mintCS = mintingPolicyToId(mint)
const lock = await readLockValidator()
const distro = await readDistroValidator()

// Apply Parameters To Validators //

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

async function readLockValidator(): Promise<SpendingValidator> {
	const blueprint = JSON.parse(await Deno.readTextFile("plutus.json"));
	const validator = blueprint.validators.find((v: any) => v.title === "frac.locking.spend");
	return {
		type: "PlutusV3",
		script: applyParamsToScript(applyDoubleCborEncoding(validator.compiledCode), [ownerPKH, mintCS]),
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

const ownerAddress = (await Deno.readTextFile("./owner.addr")).trim();

const beneficiaryPublicKeyHash = paymentCredentialOf((await Deno.readTextFile("beneficiary.addr")).trim()).hash;

const beneficiaryAddress = (await Deno.readTextFile("./beneficiary.addr")).trim();

// Datums & Redeemers //

const tokenName = fromText("FTOIC01")

const redeemer = Data.to(new Constr(0, [BigInt(1), BigInt(0)]))
const mintRedeemer = Data.to(new Constr(0, [BigInt(1), BigInt(1000), tokenName]))

const artist = new Map<Data, Data>();
artist.set(fromText("name"), fromText("Artist Name"));

const songData = new Map<Data, Data>();
songData.set(fromText("song_title"), fromText("My Fractional Track"));
songData.set(fromText("song_duration"), fromText("PT3M45S")); // Required ISO-8601 duration
songData.set(fromText("track_number"), BigInt(1));
songData.set(fromText("artists"), [artist]); // Array of Artist maps

const fileData = new Map<Data, Data>();
fileData.set(fromText("name"), fromText("My Fractional Track Audio"));
fileData.set(fromText("mediaType"), fromText("audio/mpeg"));
fileData.set(fromText("src"), fromText("ipfs://your-audio-file-cid-here"));
fileData.set(fromText("song"), songData);

const releaseData = new Map<Data, Data>();
releaseData.set(fromText("release_title"), fromText("The Fractional Album"));
releaseData.set(fromText("release_type"), fromText("Single"));

const metadata = new Map<Data, Data>();
metadata.set(fromText("name"), fromText("My Fractional NFT"));
metadata.set(fromText("description"), fromText("A fractionalized masterpiece."));
metadata.set(fromText("image"), fromText("ipfs://your-image-cid-here"));
metadata.set(fromText("music_metadata_version"), BigInt(3)); // CIP-60 Version 3
metadata.set(fromText("release"), releaseData);
metadata.set(fromText("files"), [fileData]);
metadata.set(fromText("royalty_rate"), fromText("0.05"));
metadata.set(fromText("royalty_address"), fromText(ownerAddress));

const lDatum = Data.to(new Constr(0, [metadata, BigInt(1)]));
const dDatum = Data.to(new Constr(0, [BigInt(420)]));

const lAddress = validatorToAddress("Preprod", lock)
const dAddress = validatorToAddress("Preprod", distro)

// Transaction Execution //

// const splitUtxo = await splitUtxos() // only do this if you need to free up UTxOs

// await lucid.awaitTx(splitUtxo)

// console.log(`Transactions Split!
//     Tx Hash: ${splitUtxo}
// `)

// PHASE controls which steps to execute.
// Set to "mint"   → mint tokens (first run)
// Set to "distro" → distribute tokens (after mint confirms)
// Set to "update" → update metadata (after distro confirms)
// Set to "all"    → run everything sequentially (can use if wallet has many UTxOs)
const PHASE = ("update" as string) as "mint" | "distro" | "update" | "all";

try {
	// Uncomment to split UTxOs (run once if wallet only has 1 UTxO):
	// const splitTx = await splitUtxos()
	// await lucid.awaitTx(splitTx)
	// console.log(`✅ UTxOs split! Tx Hash: ${splitTx}\nNow re-run the script to mint tokens.`)

	if (PHASE === "mint" || PHASE === "all") {
		const mintToken = await mintTokens()
		await lucid.awaitTx(mintToken)
		console.log(`✅ Minted Fractionalised NFT!
	    Tx Hash: ${mintToken}
	    PolicyID : ${mintCS}
	`)
	}

	if (PHASE === "distro" || PHASE === "all") {
		const distroToken = await distroTokens()
		await lucid.awaitTx(distroToken)
		console.log(`✅ Distributed Token!
	    Tx Hash: ${distroToken}
	`)
	}

	if (PHASE === "update" || PHASE === "all") {
		const updateToken = await updateTokens()
		await lucid.awaitTx(updateToken)
		console.log(`✅ Updated NFT!
	    Tx Hash: ${updateToken}
	`)
	}
} catch (error: unknown) {
	const errStr = String((error as Error).message || error);
	if (errStr.includes("not have enough funds")) {
		console.error("\n❌ Transaction Failed: Insufficient funds.");
		console.error("Your 'owner.addr' wallet does not have enough ADA to cover the transaction costs.");
		console.error("Please fund it using the Preprod testnet faucet: https://docs.cardano.org/cardano-testnets/tools/faucet/");
	} else if (errStr.includes("BadInputsUTxO") || errStr.includes("Stale UTxO")) {
		console.error("\n❌ Transaction Failed: Stale UTxO.");
		console.error("A UTxO used in this transaction was already spent. Wait for chain sync (~20-30s) and retry.");
	} else if (errStr.includes("NoCollateralInputs") || errStr.includes("InsufficientCollateral")) {
		console.error("\n❌ Transaction Failed: No collateral UTxO.");
		console.error("Your wallet only has 1 UTxO. Uncomment splitUtxos() at the top of the try block and run once.");
	} else {
		console.error("\n❌ An unexpected error occurred:", error);
	}
}

// Transactions //

async function mintTokens() {
	const tx = await lucid
		.newTx()
		.mintAssets({
			[toUnit(mintCS, tokenName, 100)]: BigInt(1),
			[toUnit(mintCS, tokenName, 444)]: BigInt(1000)
		}, mintRedeemer)
		.attach.MintingPolicy(mint)
		.pay.ToContract(lAddress, { kind: "inline", value: lDatum }, { [toUnit(mintCS, tokenName, 100)]: BigInt(1) })
		.pay.ToContract(dAddress, { kind: "inline", value: dDatum }, { [toUnit(mintCS, tokenName, 444)]: BigInt(1000) })
		.addSignerKey(ownerPKH)
		.complete()

	const signedTx = await tx.sign.withWallet().complete()

	return signedTx.submit()
}

async function distroTokens() {
	const unit = toUnit(mintCS, tokenName, 444)
	const utxos: UTxO[] = await lucid.utxosAtWithUnit(dAddress, unit)
	const utxo: UTxO = utxos[0]
	const value = await utxo.assets[unit]
	const outValue = value - 1n

	console.log(value)

	const tx = await lucid
		.newTx()
		.collectFrom([utxo], redeemer)
		.attach.SpendingValidator(distro)
		.pay.ToAddress(beneficiaryAddress, { [unit]: 1n })
		.pay.ToContract(dAddress, { kind: "inline", value: dDatum }, { [unit]: outValue })
		.complete()

	const signedTx = await tx.sign.withWallet().complete()

	return signedTx.submit()
}

async function updateTokens() {
	const unit = toUnit(mintCS, tokenName, 100)
	const utxos = await lucid.utxosAtWithUnit(lAddress, unit)
	const utxo = utxos[0]
	console.log(utxo)
	const artist2 = new Map<Data, Data>();
	artist2.set(fromText("name"), fromText("Artist Name"));

	const songData2 = new Map<Data, Data>();
	songData2.set(fromText("song_title"), fromText("My Fractional Track"));
	songData2.set(fromText("song_duration"), fromText("PT3M45S"));
	songData2.set(fromText("track_number"), BigInt(1));
	songData2.set(fromText("artists"), [artist2]);

	const fileData2 = new Map<Data, Data>();
	fileData2.set(fromText("name"), fromText("My Fractional Track Audio"));
	fileData2.set(fromText("mediaType"), fromText("audio/mpeg"));
	fileData2.set(fromText("src"), fromText("ipfs://your-audio-file-cid-here"));
	fileData2.set(fromText("song"), songData2);

	const releaseData2 = new Map<Data, Data>();
	releaseData2.set(fromText("release_title"), fromText("The Fractional Album"));
	releaseData2.set(fromText("release_type"), fromText("Single"));

	const metadata2 = new Map<Data, Data>();
	metadata2.set(fromText("name"), fromText("My Fractional NFT (Updated)"));
	metadata2.set(fromText("description"), fromText("A fractionalized masterpiece."));
	metadata2.set(fromText("image"), fromText("ipfs://your-new-image-cid"));
	metadata2.set(fromText("music_metadata_version"), BigInt(3));
	metadata2.set(fromText("release"), releaseData2);
	metadata2.set(fromText("files"), [fileData2]);
	metadata2.set(fromText("royalty_rate"), fromText("0.05"));
	metadata2.set(fromText("royalty_address"), fromText(ownerAddress));

	const lDatum2 = Data.to(new Constr(0, [metadata2, BigInt(2)]));

	const tx = await lucid
		.newTx()
		.collectFrom([utxo], redeemer)
		.attach.SpendingValidator(lock)
		.pay.ToContract(lAddress, { kind: "inline", value: lDatum2 }, { [unit]: BigInt(1) })
		.addSignerKey(ownerPKH)
		.complete()

	const signedTx = await tx.sign.withWallet().complete()

	return signedTx.submit()
}

// Split UTxOs // 
// Do this after you use the testnet faucet,
// to create more utxos at your wallet

async function splitUtxos() {
	const tx = await lucid
		.newTx()
		.pay.ToAddress(ownerAddress, { lovelace: 4000000n })
		.pay.ToAddress(ownerAddress, { lovelace: 4000000n })
		.pay.ToAddress(ownerAddress, { lovelace: 4000000n })
		.pay.ToAddress(ownerAddress, { lovelace: 4000000n })
		.pay.ToAddress(ownerAddress, { lovelace: 4000000n })
		.complete()

	const signedTx = await tx.sign.withWallet().complete()

	return signedTx.submit()
}