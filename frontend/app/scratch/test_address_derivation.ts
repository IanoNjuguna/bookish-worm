import { getContractAddresses } from "../lib/contractHelper";
import { Lucid, Blockfrost } from "@lucid-evolution/lucid";
import { CARDANO_NETWORK, BLOCKFROST_PROJECT_ID } from "../lib/config";

async function run() {
	const blockfrostUrl = "https://cardano-preprod.blockfrost.io/api/v0";
	const projectId = "preprod5G93IuxWkvkMBl6HdsAvx3K0v7HTOK6r";
	const blockfrostProvider = new Blockfrost(blockfrostUrl, projectId);
	const lucid = await Lucid(blockfrostProvider, "Preprod");

	const stakeAddr = "stake_test1uqyadg8zs9c4h8kg5ttmqeltfsnft62e5n8n6st368c9s4q7g3vaf";
	const paymentAddr = "addr_test1qppgtfqr8v03k7gz3ulsd64tcy42s3gar4cqd5y8eu4k9fsf66sw9qt3tw0v3gkhkpn7knpxjh54nfx084qhr50stp2qyc89hl";

	console.log("Deriving address for STAKE address:", stakeAddr);
	try {
		const resStake = await getContractAddresses(stakeAddr);
		console.log("Derived dAddress:", resStake.dAddress);
		console.log("Derived ownerPKH:", resStake.ownerPKH);
	} catch (e) {
		console.error("Failed for stake address:", e);
	}

	console.log("\nDeriving address for PAYMENT address:", paymentAddr);
	try {
		const resPayment = await getContractAddresses(paymentAddr);
		console.log("Derived dAddress:", resPayment.dAddress);
		console.log("Derived ownerPKH:", resPayment.ownerPKH);
	} catch (e) {
		console.error("Failed for payment address:", e);
	}
}

run().catch(console.error);
