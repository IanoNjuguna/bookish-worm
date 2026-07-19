import { toUnit, fromText } from "@lucid-evolution/lucid";

const policyId = "10c1a6929b55a8c04253f8b55c890d920831c03b5bb7b14ffb9fbfc1";
const tokenName = fromText("MUDDIB");
const unit = toUnit(policyId, tokenName, 444);
console.log("Unit for 444:", unit);
