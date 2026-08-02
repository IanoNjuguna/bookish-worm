import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

async function test() {
  const projectId = "preprod5G93IuxWkvkMBl6HdsAvx3K0v7HTOK6r";
  const api = new BlockFrostAPI({
    projectId,
    network: "preprod"
  });

  const assetUnit = "e51e9938b3ff352d01a4ad360ee07e15081d7d61c9d79fc5348d4d79001bc2804c49444f";
  
  console.log(`Fetching holders for asset ${assetUnit}...`);
  try {
    const holders = await api.assetsAddresses(assetUnit);
    console.log("Holders response:", JSON.stringify(holders, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
