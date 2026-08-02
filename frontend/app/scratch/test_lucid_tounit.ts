import { Lucid } from "@lucid-evolution/lucid";

// Since we just need to import toUnit, we can import it from the library
async function run() {
  const { toUnit, fromText } = await import("@lucid-evolution/lucid");
  const policy = "10c1a6929b55a8c04253f8b55c890d920831c03b5bb7b14ffb9fbfc1";
  const nameHex = fromText("MUADDIB");
  console.log("nameHex:", nameHex);
  
  const unit100 = toUnit(policy, nameHex, 100);
  console.log("unit 100:", unit100);
  console.log("label 100 prefix:", unit100.substring(56, 64));

  const unit444 = toUnit(policy, nameHex, 444);
  console.log("unit 444:", unit444);
  console.log("label 444 prefix:", unit444.substring(56, 64));
}

run().catch(console.error);
