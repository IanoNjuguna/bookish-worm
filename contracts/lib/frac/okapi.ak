// frac/okapi — helper functions for the Doba Protocol validators
// Aiken stdlib v2.1.0 / Plutus V3

use aiken/primitive/bytearray
use aiken/collection/dict
use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Script}
use cardano/assets.{AssetName, PolicyId, Value}
use cardano/transaction.{Input, Output, OutputReference, Transaction}

// ─── Signature Check ──────────────────────────────────────────────────────────

/// Returns True if the transaction is signed by the given verification key hash.
pub fn tx_signed_by(transaction: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(transaction.extra_signatories, pkh)
}

// ─── Input / Output Helpers ───────────────────────────────────────────────────

/// Returns the input being spent, identified by its OutputReference.
pub fn get_own_input(transaction: Transaction, oref: OutputReference) -> Input {
  expect Some(input) =
    list.find(transaction.inputs, fn(i) { i.output_reference == oref })
  input
}

/// Extracts the script hash from the payment credential of the input being spent.
/// Fails if the input is not locked by a script.
pub fn get_own_script_hash(
  transaction: Transaction,
  oref: OutputReference,
) -> ByteArray {
  let input = get_own_input(transaction, oref)
  expect Script(hash) = input.output.address.payment_credential
  hash
}

/// Returns the single output sent back to the same script address.
/// Fails if there is not exactly one such output (prevents double-satisfaction attacks).
pub fn get_own_singleton_output(
  transaction: Transaction,
  script_hash: ByteArray,
) -> Output {
  let own_outputs =
    list.filter(
      transaction.outputs,
      fn(o) { o.address.payment_credential == Script(script_hash) },
    )
  expect [output] = own_outputs
  output
}

// ─── Value / Asset Checks ─────────────────────────────────────────────────────

/// Returns True if the value contains exactly 1 token under the given policy
/// (the token name is unconstrained, but there must be exactly one).
pub fn contains_single_token_of(value: Value, policy_id: PolicyId) -> Bool {
  let token_pairs =
    value
      |> assets.tokens(policy_id)
      |> dict.to_pairs()
  when token_pairs is {
    [Pair(_, qty)] -> qty == 1
    _ -> False
  }
}

/// Returns True if `out_value` contains exactly one fewer of a single asset
/// compared to `in_value`, and no other non-lovelace assets change.
/// Used to verify that exactly one fraction token was disbursed in a Buy tx.
pub fn has_one_singleton_asset_less(in_value: Value, out_value: Value) -> Bool {
  // Compute the difference: in - out (positive means consumed)
  let diff =
    assets.merge(assets.without_lovelace(in_value), assets.negate(assets.without_lovelace(out_value)))
  // The diff must contain exactly 1 policy, 1 asset name, quantity exactly 1
  let policies = assets.policies(diff)
  when policies is {
    [policy_id] -> {
      let token_pairs =
        diff
          |> assets.tokens(policy_id)
          |> dict.to_pairs()
      when token_pairs is {
        [Pair(_, qty)] -> qty == 1
        _ -> False
      }
    }
    _ -> False
  }
}

// ─── CIP-68 Token Name Helpers ────────────────────────────────────────────────

/// Builds the two CIP-68 token names for a given base name:
///   [0] = Reference token  (label 100 prefix = 0x000643b0)
///   [1] = Fractional token (label 444 prefix = 0x001bc280)
pub fn fraction_token_prefix(base_name: ByteArray) -> List<ByteArray> {
  let ref_prefix = #"000643b0"
  let frac_prefix = #"001bc280"
  [
    bytearray.concat(ref_prefix, base_name),
    bytearray.concat(frac_prefix, base_name),
  ]
}

/// Compares a token name against an optional expected name.
/// Returns False if the expected name is None.
pub fn compare_token_names(
  name: AssetName,
  expected: Option<AssetName>,
) -> Bool {
  when expected is {
    Some(e) -> name == e
    None -> False
  }
}
