import { Blockfrost, Lucid } from "npm:@lucid-evolution/lucid@0.5.5";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const env = await load({ envPath: "../.env" });
const BLOCKFROST = env["NEXT_PUBLIC_BLOCKFROST_PROJECT_ID"];

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

const beneficiaryAddress = (await Deno.readTextFile("./beneficiary.addr")).trim();

try {
	const tx = await lucid
		.newTx()
		.pay.ToAddress(beneficiaryAddress, { lovelace: 5000000n }) // Send 5 ADA
		.complete();

	const signedTx = await tx.sign.withWallet().complete();
	const txHash = await signedTx.submit();

	console.log(`✅ Successfully sent 15 ADA to buyer! Tx Hash: ${txHash}`);
} catch (error: unknown) {
	console.error("❌ Error sending ADA:", error);
}
