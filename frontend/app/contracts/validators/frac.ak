use aiken/collection/dict
use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address, Script, VerificationKey}
use cardano/assets.{AssetName, PolicyId, Value}
use cardano/assets
use cardano/transaction.{InlineDatum, OutputReference, Transaction, placeholder, Input, Output, NoDatum}
use frac/okapi as ok

// ─── Minting Policy ───────────────────────────────────────────────────────────
//
// Parameters (all baked into the policy id, so every release gets its own):
//   owner        – creator PKH, must sign every mint/burn
//   token_name   – CIP-68 base token name; ref/frac names are derived from it
//   max_supply   – the cap, enforced here at mint time
//   seed         – output reference spent by the mint. A UTxO can only be spent
//                  once, so this policy can mint exactly once: the cap is
//                  structural, not a promise.
//
// A release minted under this policy has max_supply fractions, forever.

pub type MintAction {
  action: Int,
  // 1 = Mint, any other = Burn
}

pub type TokenDatum {
  metadata: Pairs<ByteArray, Data>,
  version: Int,
}

/// True if this output carries exactly one reference token with an inline CIP-68 datum.
fn ref_output_ok(output: Output, policy_id: PolicyId, ref_asset_name: AssetName) -> Bool {
  if assets.quantity_of(output.value, policy_id, ref_asset_name) == 1 {
    when output.datum is {
      InlineDatum(raw) -> {
        expect _datum: TokenDatum = raw
        True
      }
      _ -> False
    }
  } else {
    False
  }
}

validator fraction_minting(
  owner: VerificationKeyHash,
  token_name: ByteArray,
  max_supply: Int,
  seed: OutputReference,
) {
  mint(r: MintAction, policy_id: PolicyId, transaction: Transaction) {
    let Transaction { mint, outputs, inputs, .. } = transaction

    let token_names = ok.fraction_token_prefix(token_name)
    expect [ref_asset_name, frac_asset_name] = token_names

    expect [Pair(minted_ref_name, minted_ref_qty), Pair(minted_frac_name, minted_frac_qty)] =
      mint
        |> assets.tokens(policy_id)
        |> dict.to_pairs()

    when r.action is {
      1 -> {
        // one-shot: the seed UTxO must be consumed here, and a UTxO can only be
        // consumed once, so no second mint of this policy can ever validate
        let seed_spent = list.any(inputs, fn(i) { i.output_reference == seed })
        // the cap is a parameter, and the whole supply must be minted at once
        let amounts_ok =
          minted_ref_name == ref_asset_name && minted_ref_qty == 1 && minted_frac_name == frac_asset_name && minted_frac_qty == max_supply
        let ref_output_present =
          list.any(outputs, fn(o) { ref_output_ok(o, policy_id, ref_asset_name) })
        let frac_output_present =
          list.any(
            outputs,
            fn(o) { assets.quantity_of(o.value, policy_id, frac_asset_name) == max_supply },
          )

        ok.tx_signed_by(transaction, owner) && max_supply > 0 && seed_spent && amounts_ok && ref_output_present && frac_output_present
      }
      _ -> {
        // Burn: never positive, at most the single reference token, never more
        // than the cap of fractions, and at least something must be burned
        let burn_amounts_ok =
          minted_ref_qty <= 0 && minted_ref_qty >= -1 && minted_frac_qty <= 0 && minted_frac_qty >= -max_supply
        let burns_something = minted_ref_qty < 0 || minted_frac_qty < 0

        ok.tx_signed_by(transaction, owner) && minted_ref_name == ref_asset_name && minted_frac_name == frac_asset_name && burn_amounts_ok && burns_something
      }
    }
  }

  else(_) {
    fail
  }
}

// ─── Ref Token Locking Validator ──────────────────────────────────────────────

pub type LockAction {
  action: Int,
  // 1 = Update metadata, any other = Unlock/Burn
  field_b: Int,
}

validator locking(owner: VerificationKeyHash, cs: PolicyId) {
  spend(
    _d: Option<TokenDatum>,
    r: LockAction,
    oref: OutputReference,
    transaction: Transaction,
  ) {
    when r.action is {
      1 -> {
        let own_hash = ok.get_own_script_hash(transaction, oref)
        let out = ok.get_own_singleton_output(transaction, own_hash)
        let valid_datum =
          when out.datum is {
            InlineDatum(raw) -> {
              expect _datum: TokenDatum = raw
              True
            }
            _ -> False
          }
        ok.contains_single_token_of(out.value, cs) && ok.tx_signed_by(
          transaction,
          owner,
        ) && valid_datum
      }
      _ -> ok.tx_signed_by(transaction, owner)
    }
  }

  else(_) {
    fail
  }
}

// ─── Distribution Validator ───────────────────────────────────────────────────
//
// Parameters:
//   owner        – creator PKH; can reclaim unsold fractions or update price
//   treasury     – platform wallet address that receives the 1% fee on every Buy
//   fee_bps      – fee in basis points (100 = 1%)
//
// DisDatum now carries the price in lovelace so the script can enforce payment.

pub type DisDatum {
  price_lovelace: Int,
}

pub type DisAction {
  action: Int,
  // 1 = Buy, 2 = UpdatePrice, any other = Reclaim
  field_b: Int,
}

validator distribution(
  owner: VerificationKeyHash,
  treasury: Address,
  fee_bps: Int,
) {
  spend(
    d: Option<DisDatum>,
    r: DisAction,
    oref: OutputReference,
    transaction: Transaction,
  ) {
    when r.action is {
      // ── Buy ──────────────────────────────────────────────────────────────
      // Anyone can buy: no owner signature required.
      // Checks:
      //   1. Exactly one fewer fraction token in the script output vs input.
      //   2. Treasury receives at least `price_lovelace * fee_bps / 10000` lovelace.
      //   3. The datum is preserved in the continuing output (same price_lovelace).
      1 -> {
        expect Some(datum) = d
        let price = datum.price_lovelace
        let fee = price * fee_bps / 10000

        let own_hash = ok.get_own_script_hash(transaction, oref)
        let in = ok.get_own_input(transaction, oref)

        // 1. Prevent double satisfaction by disallowing batching of distribution inputs
        let own_inputs =
          list.filter(
            transaction.inputs,
            fn(i) { i.output.address.payment_credential == Script(own_hash) },
          )
        let single_input = list.length(own_inputs) == 1

        // 2. Fraction accounting, datum preservation, and Lovelace preservation
        let own_outputs =
          list.filter(
            transaction.outputs,
            fn(o) { o.address.payment_credential == Script(own_hash) },
          )

        let fraction_ok =
          when own_outputs is {
            // Case A: Last token purchased, no continuing output is sent back to the script
            [] -> {
              let val_dict =
                assets.to_dict(assets.without_lovelace(in.output.value))
              when dict.to_pairs(val_dict) is {
                [Pair(_, tokens_dict)] ->
                  when dict.to_pairs(tokens_dict) is {
                    [Pair(_, quantity)] -> quantity == 1
                    _ -> False
                  }
                _ -> False
              }
            }
            // Case B: Continuing output exists, verify it has exactly 1 less token and preserves datum/ADA
            [out] -> {
              let has_less =
                ok.has_one_singleton_asset_less(in.output.value, out.value)
              let datum_preserved =
                when out.datum is {
                  InlineDatum(raw) -> {
                    expect d2: DisDatum = raw
                    d2.price_lovelace == price
                  }
                  _ -> False
                }
              let lovelace_preserved =
                assets.lovelace_of(out.value) >= assets.lovelace_of(
                  in.output.value,
                )
              has_less && datum_preserved && lovelace_preserved
            }
            // Case C: Malformed transaction (more than 1 output sent to the script)
            _ -> False
          }

        // 3. Treasury fee payment
        let treasury_paid =
          list.any(
            transaction.outputs,
            fn(o) {
              o.address == treasury && assets.lovelace_of(o.value) >= fee
            },
          )

        // 4. Creator payment
        let creator_paid =
          list.any(
            transaction.outputs,
            fn(o) {
              o.address.payment_credential == VerificationKey(owner) &&
                assets.lovelace_of(o.value) >= (price - fee)
            },
          )

        fraction_ok && treasury_paid && creator_paid && single_input
      }

      // ── UpdatePrice ──────────────────────────────────────────────────────
      // Only the owner can update the price stored in the datum.
      // The fraction tokens must remain locked in the script.
      2 -> {
        let own_hash = ok.get_own_script_hash(transaction, oref)
        let out = ok.get_own_singleton_output(transaction, own_hash)
        let in = ok.get_own_input(transaction, oref)

        // Tokens must not leave the contract
        let tokens_preserved = assets.without_lovelace(in.output.value) == assets.without_lovelace(out.value)

        // New price must be positive (encoded in continuing output datum)
        let valid_new_price =
          when out.datum is {
            InlineDatum(raw) -> {
              expect new_d: DisDatum = raw
              new_d.price_lovelace > 0
            }
            _ -> False
          }

        ok.tx_signed_by(transaction, owner) && tokens_preserved && valid_new_price
      }

      // ── Reclaim ──────────────────────────────────────────────────────────
      // Owner withdraws unsold fractions from the distribution pool.
      _ -> ok.tx_signed_by(transaction, owner)
    }
  }

  else(_) {
    fail
  }
}

// ─── UNIT TESTS ──────────────────────────────────────────────────────────────

const test_owner_pkh: VerificationKeyHash = #"0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20"
const test_buyer_pkh: VerificationKeyHash = #"a1a2a3a4a5a6a7a8a9a0abacadaeaf101112131415161718191a1b1c1d1e1f20"
const test_treasury_pkh: VerificationKeyHash = #"f1f2f3f4f5f6f7f8f9f0fafbfcfdfe101112131415161718191a1b1c1d1e1f20"

const mock_policy: PolicyId = #"feed1234567890abcdeffeed1234567890abcdeffeed1234567890abcdef"
const mock_asset_name: AssetName = #"001bc28046544f49433031" // prefix + FTOIC01

fn get_treasury_address() -> Address {
  Address {
    payment_credential: VerificationKey(test_treasury_pkh),
    stake_credential: None
  }
}

fn get_owner_address() -> Address {
  Address {
    payment_credential: VerificationKey(test_owner_pkh),
    stake_credential: None
  }
}

fn make_distro_address(script_hash: ByteArray) -> Address {
  Address {
    payment_credential: Script(script_hash),
    stake_credential: None
  }
}

test test_successful_buy() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  let owner_addr = get_owner_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  
  let price = 5_000_000 // 5 ADA
  let fee = price * 100 / 10000 // 1% = 50,000 lovelace
  
  // Script Input: Has 1000 fraction tokens
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
    
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: price }),
      reference_script: None
    }
  }

  // Script Output: Has 999 fraction tokens (1 purchased)
  let output_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 999)
    
  let script_output = Output {
    address: distro_addr,
    value: output_val,
    datum: InlineDatum(DisDatum { price_lovelace: price }),
    reference_script: None
  }

  // Treasury Output: Receives 1% fee (50,000 lovelace)
  let treasury_output = Output {
    address: treasury_addr,
    value: assets.from_lovelace(fee),
    datum: NoDatum,
    reference_script: None
  }

  // Creator Output: Receives price - fee (4,950,000 lovelace)
  let creator_output = Output {
    address: owner_addr,
    value: assets.from_lovelace(price - fee),
    datum: NoDatum,
    reference_script: None
  }

  // Construct Transaction Context
  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    outputs: [script_output, treasury_output, creator_output]
  }

  // Execute spend validator for Buy action
  distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: price }),
    DisAction { action: 1, field_b: 0 },
    oref,
    tx
  )
}

test test_buy_fails_no_fee() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  let owner_addr = get_owner_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  let price = 5_000_000
  let fee = price * 100 / 10000
  
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: price }),
      reference_script: None
    }
  }

  // Output has 999 fractions but NO treasury output is created
  let output_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 999)
  let script_output = Output {
    address: distro_addr,
    value: output_val,
    datum: InlineDatum(DisDatum { price_lovelace: price }),
    reference_script: None
  }

  // Creator Output: Receives price - fee (4,950,000 lovelace)
  let creator_output = Output {
    address: owner_addr,
    value: assets.from_lovelace(price - fee),
    datum: NoDatum,
    reference_script: None
  }

  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    outputs: [script_output, creator_output]
  }

  let success = distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: price }),
    DisAction { action: 1, field_b: 0 },
    oref,
    tx
  )
  
  !success
}

test test_successful_price_update() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  let old_price = 5_000_000
  let new_price = 8_000_000 // Creator increases price to 8 ADA
  
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: old_price }),
      reference_script: None
    }
  }

  // Output must preserve all 1000 fraction tokens
  let script_output = Output {
    address: distro_addr,
    value: input_val,
    datum: InlineDatum(DisDatum { price_lovelace: new_price }),
    reference_script: None
  }

  // Transaction must be signed by owner
  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    outputs: [script_output],
    extra_signatories: [test_owner_pkh]
  }

  distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: old_price }),
    DisAction { action: 2, field_b: 0 },
    oref,
    tx
  )
}

test test_price_update_fails_no_owner_signature() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  let old_price = 5_000_000
  let new_price = 8_000_000
  
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: old_price }),
      reference_script: None
    }
  }

  let script_output = Output {
    address: distro_addr,
    value: input_val,
    datum: InlineDatum(DisDatum { price_lovelace: new_price }),
    reference_script: None
  }

  // Signed by buyer, NOT owner
  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    outputs: [script_output],
    extra_signatories: [test_buyer_pkh]
  }

  let success = distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: old_price }),
    DisAction { action: 2, field_b: 0 },
    oref,
    tx
  )
  
  !success
}

test test_successful_reclaim() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  let price = 5_000_000
  
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: price }),
      reference_script: None
    }
  }

  // Action is Reclaim (action = 3 / anything other than 1 and 2)
  // Signed by owner
  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    extra_signatories: [test_owner_pkh]
  }

  distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: price }),
    DisAction { action: 3, field_b: 0 },
    oref,
    tx
  )
}

test test_buy_fails_fee_underpayment() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  let owner_addr = get_owner_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  let price = 5_000_000
  let fee = price * 100 / 10000 // 1% = 50,000 lovelace
  
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
    
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: price }),
      reference_script: None
    }
  }

  let output_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 999)
    
  let script_output = Output {
    address: distro_addr,
    value: output_val,
    datum: InlineDatum(DisDatum { price_lovelace: price }),
    reference_script: None
  }

  // Treasury only receives 49,999 lovelace (underpayment by 1 lovelace)
  let treasury_output = Output {
    address: treasury_addr,
    value: assets.from_lovelace(fee - 1),
    datum: NoDatum,
    reference_script: None
  }

  // Creator Output: Receives price - fee (4,950,000 lovelace)
  let creator_output = Output {
    address: owner_addr,
    value: assets.from_lovelace(price - fee),
    datum: NoDatum,
    reference_script: None
  }

  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    outputs: [script_output, treasury_output, creator_output]
  }

  let success = distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: price }),
    DisAction { action: 1, field_b: 0 },
    oref,
    tx
  )
  
  !success
}

test test_price_update_fails_invalid_price() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  let old_price = 5_000_000
  let new_price = 0 // Invalid price!
  
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: old_price }),
      reference_script: None
    }
  }

  let script_output = Output {
    address: distro_addr,
    value: input_val,
    datum: InlineDatum(DisDatum { price_lovelace: new_price }),
    reference_script: None
  }

  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    outputs: [script_output],
    extra_signatories: [test_owner_pkh]
  }

  let success = distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: old_price }),
    DisAction { action: 2, field_b: 0 },
    oref,
    tx
  )
  
  !success
}

test test_buy_fails_datum_mismatch() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  let owner_addr = get_owner_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  let price = 5_000_000
  let fee = price * 100 / 10000
  
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: price }),
      reference_script: None
    }
  }

  let output_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 999)
  
  // Continuing output datum has changed price to 4,000,000 (datum hijacking)
  let script_output = Output {
    address: distro_addr,
    value: output_val,
    datum: InlineDatum(DisDatum { price_lovelace: 4_000_000 }),
    reference_script: None
  }

  let treasury_output = Output {
    address: treasury_addr,
    value: assets.from_lovelace(fee),
    datum: NoDatum,
    reference_script: None
  }

  // Creator Output: Receives price - fee (4,950,000 lovelace)
  let creator_output = Output {
    address: owner_addr,
    value: assets.from_lovelace(price - fee),
    datum: NoDatum,
    reference_script: None
  }

  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    outputs: [script_output, treasury_output, creator_output]
  }

  let success = distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: price }),
    DisAction { action: 1, field_b: 0 },
    oref,
    tx
  )
  
  !success
}

test test_buy_fails_creator_underpayment() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  let owner_addr = get_owner_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  let price = 5_000_000
  let fee = price * 100 / 10000 // 1% = 50,000 lovelace
  
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: price }),
      reference_script: None
    }
  }

  let output_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 999)
  let script_output = Output {
    address: distro_addr,
    value: output_val,
    datum: InlineDatum(DisDatum { price_lovelace: price }),
    reference_script: None
  }

  let treasury_output = Output {
    address: treasury_addr,
    value: assets.from_lovelace(fee),
    datum: NoDatum,
    reference_script: None
  }

  // Underpay creator: pays 4,949,999 lovelace (underpayment by 1 lovelace)
  let creator_output = Output {
    address: owner_addr,
    value: assets.from_lovelace(price - fee - 1),
    datum: NoDatum,
    reference_script: None
  }

  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    outputs: [script_output, treasury_output, creator_output]
  }

  let success = distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: price }),
    DisAction { action: 1, field_b: 0 },
    oref,
    tx
  )
  
  !success
}

test test_successful_buy_last_token() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  let owner_addr = get_owner_address()
  
  let oref = OutputReference { transaction_id: #"1111", output_index: 0 }
  
  let price = 5_000_000 // 5 ADA
  let fee = price * 100 / 10000 // 1% = 50,000 lovelace
  
  // Script Input: Has exactly 1 fraction token left
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1)
    
  let input = Input {
    output_reference: oref,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: price }),
      reference_script: None
    }
  }

  // NO Script Output (contract is empty)
  // Treasury Output: Receives 1% fee (50,000 lovelace)
  let treasury_output = Output {
    address: treasury_addr,
    value: assets.from_lovelace(fee),
    datum: NoDatum,
    reference_script: None
  }

  // Creator Output: Receives price - fee (4,950,000 lovelace)
  let creator_output = Output {
    address: owner_addr,
    value: assets.from_lovelace(price - fee),
    datum: NoDatum,
    reference_script: None
  }

  // Construct Transaction Context
  let tx = Transaction {
    ..placeholder,
    inputs: [input],
    outputs: [treasury_output, creator_output]
  }

  // Execute spend validator for Buy action
  distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: price }),
    DisAction { action: 1, field_b: 0 },
    oref,
    tx
  )
}

test test_buy_fails_double_satisfaction() {
  let script_hash: ByteArray = #"ffff"
  let distro_addr = make_distro_address(script_hash)
  let treasury_addr = get_treasury_address()
  let owner_addr = get_owner_address()
  
  let oref1 = OutputReference { transaction_id: #"1111", output_index: 0 }
  let oref2 = OutputReference { transaction_id: #"1111", output_index: 1 }
  
  let price = 5_000_000
  let fee = price * 100 / 10000
  
  let input_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 1000)
    
  let input1 = Input {
    output_reference: oref1,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: price }),
      reference_script: None
    }
  }

  let input2 = Input {
    output_reference: oref2,
    output: Output {
      address: distro_addr,
      value: input_val,
      datum: InlineDatum(DisDatum { price_lovelace: price }),
      reference_script: None
    }
  }

  let output_val = assets.from_lovelace(2_000_000)
    |> assets.add(mock_policy, mock_asset_name, 999)
    
  let script_output1 = Output {
    address: distro_addr,
    value: output_val,
    datum: InlineDatum(DisDatum { price_lovelace: price }),
    reference_script: None
  }

  let script_output2 = Output {
    address: distro_addr,
    value: output_val,
    datum: InlineDatum(DisDatum { price_lovelace: price }),
    reference_script: None
  }

  let treasury_output = Output {
    address: treasury_addr,
    value: assets.from_lovelace(fee),
    datum: NoDatum,
    reference_script: None
  }

  let creator_output = Output {
    address: owner_addr,
    value: assets.from_lovelace(price - fee),
    datum: NoDatum,
    reference_script: None
  }

  // Construct Transaction Context with TWO distro script inputs
  let tx = Transaction {
    ..placeholder,
    inputs: [input1, input2],
    outputs: [script_output1, script_output2, treasury_output, creator_output]
  }

  // Executing for the first input should fail because there are 2 inputs from the script
  let success = distribution.spend(
    test_owner_pkh,
    treasury_addr,
    100,
    Some(DisDatum { price_lovelace: price }),
    DisAction { action: 1, field_b: 0 },
    oref1,
    tx
  )
  
  !success
}




// ─── MINTING POLICY TESTS ────────────────────────────────────────────────────
//
// The cap is structural: the policy id bakes in (base name, max_supply, seed),
// and the seed UTxO must be consumed by the mint, so a second mint of the same
// release can never validate.

const mint_base_name: ByteArray = #"46544f49433031" // "FTOIC01"
const mint_cap: Int = 100

fn mint_seed() -> OutputReference {
  OutputReference { transaction_id: #"2222", output_index: 0 }
}

fn mint_ref_name() -> AssetName {
  #"000643b046544f49433031"
}

fn mint_frac_name() -> AssetName {
  #"001bc28046544f49433031"
}

fn seed_input() -> Input {
  Input {
    output_reference: mint_seed(),
    output: Output {
      address: get_owner_address(),
      value: assets.from_lovelace(5_000_000),
      datum: NoDatum,
      reference_script: None,
    },
  }
}

fn minted_value(ref_qty: Int, frac_qty: Int) -> Value {
  assets
    .zero
    |> assets.add(mock_policy, mint_ref_name(), ref_qty)
    |> assets.add(mock_policy, mint_frac_name(), frac_qty)
}

fn mint_outputs(frac_qty: Int) -> List<Output> {
  [
    Output {
      address: make_distro_address(#"ffff"),
      value: assets.from_lovelace(2_000_000) |> assets.add(mock_policy, mint_ref_name(), 1),
      datum: InlineDatum(TokenDatum { metadata: [], version: 1 }),
      reference_script: None,
    },
    Output {
      address: make_distro_address(#"eeee"),
      value: assets.from_lovelace(2_000_000) |> assets.add(mock_policy, mint_frac_name(), frac_qty),
      datum: InlineDatum(DisDatum { price_lovelace: 5_000_000 }),
      reference_script: None,
    },
  ]
}

fn mint_tx(inputs: List<Input>, mint_value: Value, frac_qty: Int) -> Transaction {
  Transaction {
    ..placeholder,
    inputs: inputs,
    outputs: mint_outputs(frac_qty),
    mint: mint_value,
    extra_signatories: [test_owner_pkh],
  }
}

test mint_exact_cap_succeeds() {
  let tx = mint_tx([seed_input()], minted_value(1, mint_cap), mint_cap)
  fraction_minting.mint(
    test_owner_pkh,
    mint_base_name,
    mint_cap,
    mint_seed(),
    MintAction { action: 1 },
    mock_policy,
    tx,
  )
}

test mint_fails_without_seed_input() {
  let other_input = Input {
    output_reference: OutputReference { transaction_id: #"3333", output_index: 0 },
    output: Output {
      address: get_owner_address(),
      value: assets.from_lovelace(5_000_000),
      datum: NoDatum,
      reference_script: None,
    },
  }
  let tx = mint_tx([other_input], minted_value(1, mint_cap), mint_cap)
  !fraction_minting.mint(
    test_owner_pkh,
    mint_base_name,
    mint_cap,
    mint_seed(),
    MintAction { action: 1 },
    mock_policy,
    tx,
  )
}

test mint_fails_over_cap() {
  let over = mint_cap + 1
  let tx = mint_tx([seed_input()], minted_value(1, over), over)
  !fraction_minting.mint(
    test_owner_pkh,
    mint_base_name,
    mint_cap,
    mint_seed(),
    MintAction { action: 1 },
    mock_policy,
    tx,
  )
}

test mint_fails_under_cap() {
  let under = mint_cap - 1
  let tx = mint_tx([seed_input()], minted_value(1, under), under)
  !fraction_minting.mint(
    test_owner_pkh,
    mint_base_name,
    mint_cap,
    mint_seed(),
    MintAction { action: 1 },
    mock_policy,
    tx,
  )
}

test mint_fails_without_owner_signature() {
  let tx = Transaction {
    ..mint_tx([seed_input()], minted_value(1, mint_cap), mint_cap),
    extra_signatories: [test_buyer_pkh],
  }
  !fraction_minting.mint(
    test_owner_pkh,
    mint_base_name,
    mint_cap,
    mint_seed(),
    MintAction { action: 1 },
    mock_policy,
    tx,
  )
}

test mint_fails_when_name_differs_from_param() {
  // redeemer no longer carries the name; the policy param decides it, so a
  // mint of a different base name under this policy cannot validate
  let wrong_name_value =
    assets
      .zero
      |> assets.add(mock_policy, mint_ref_name(), 1)
      |> assets.add(mock_policy, #"001bc28057524f4e47", mint_cap)
  let tx = mint_tx([seed_input()], wrong_name_value, mint_cap)
  !fraction_minting.mint(
    test_owner_pkh,
    mint_base_name,
    mint_cap,
    mint_seed(),
    MintAction { action: 1 },
    mock_policy,
    tx,
  )
}

test burn_ref_and_fractions_succeeds() {
  let tx = Transaction {
    ..mint_tx([seed_input()], minted_value(-1, -mint_cap), 0),
    outputs: [],
  }
  fraction_minting.mint(
    test_owner_pkh,
    mint_base_name,
    mint_cap,
    mint_seed(),
    MintAction { action: 2 },
    mock_policy,
    tx,
  )
}

test burn_fails_when_positive() {
  let tx = Transaction {
    ..mint_tx([seed_input()], minted_value(-1, mint_cap), 0),
    outputs: [],
  }
  !fraction_minting.mint(
    test_owner_pkh,
    mint_base_name,
    mint_cap,
    mint_seed(),
    MintAction { action: 2 },
    mock_policy,
    tx,
  )
}
