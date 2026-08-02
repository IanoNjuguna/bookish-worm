import { getRemainingFractionsOnChain } from "../backend/core-api/src/web3";

async function test() {
  const policyId = "e51e9938b3ff352d01a4ad360ee07e15081d7d61c9d79fc5348d4d79";
  const ticker = "LIDO";
  const tokenId = 1784280955851;
  try {
    const remaining = await getRemainingFractionsOnChain(policyId, ticker, tokenId);
    console.log("Remaining fractions on chain:", remaining);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
