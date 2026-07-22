import { verifyOwnershipOnChain } from "../backend/core-api/src/web3";

// Set environment variables for the test
process.env.BLOCKFROST_PROJECT_ID = "preprod5G93IuxWkvkMBl6HdsAvx3K0v7HTOK6r";
process.env.TURSO_URL = "file:" + require("path").resolve("backend/core-api/doba.db");

async function test() {
  console.log("Waiting for database init...");
  await new Promise(resolve => setTimeout(resolve, 2000));

  const tokenId = 1784236463703;
  const user1 = "stake_test1uqyadg8zs9c4h8kg5ttmqeltfsnft62e5n8n6st368c9s4q7g3vaf";
  const user2 = "stake_test1uqnesel09utj50sy96mqphjt4jsvqxzm5pdswnxetn6m9vg3fpwke";

  console.log(`Checking ownership for ${user1}...`);
  const owned1 = await verifyOwnershipOnChain(user1, tokenId);
  console.log(`User 1 owns track: ${owned1}`);

  console.log(`Checking ownership for ${user2}...`);
  const owned2 = await verifyOwnershipOnChain(user2, tokenId);
  console.log(`User 2 owns track: ${owned2}`);
}

test().catch(console.error);
