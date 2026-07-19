import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

async function run() {
	const blockfrostUrl = "https://cardano-preprod.blockfrost.io/api/v0";
	const projectId = "preprod5G93IuxWkvkMBl6HdsAvx3K0v7HTOK6r";
	const unit = "10c1a6929b55a8c04253f8b55c890d920831c03b5bb7b14ffb9fbfc1001bc2804d554144444942";

	console.log("Initializing Lucid...");
	const blockfrostProvider = new Blockfrost(blockfrostUrl, projectId);
	const lucid = await Lucid(blockfrostProvider, "Preprod");

	console.log("Querying UTXOs for unit:", unit);
	try {
		const utxos = await lucid.utxosAtWithUnit("addr_test1wq02w4uyv6aj2w20sdu3xggqac4a6dmdxnpm9yp6e9fj44qcsttup", unit);
		console.log("UTXOs at addr_test1wq02w4uyv6aj2w20sdu3xggqac4a6dmdxnpm9yp6e9fj44qcsttup:", utxos);
	} catch (e) {
		console.error("Error querying at distro address:", e);
	}

	try {
		// Let us query blockfrost API directly or via provider to find which addresses hold the unit
		const response = await fetch(`${blockfrostUrl}/assets/${unit}/addresses`, {
			headers: { project_id: projectId }
		});
		const addresses = await response.json();
		console.log("Addresses holding this asset on-chain:", addresses);
	} catch (e) {
		console.error("Error querying asset holders:", e);
	}
}

run().catch(console.error);
