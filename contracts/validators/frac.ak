use aiken/collection/dict
use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address, Script, VerificationKey}
use cardano/assets.{AssetName, PolicyId}
use cardano/assets
use cardano/transaction.{InlineDatum, OutputReference, Transaction, placeholder, Input, Output, NoDatum}
use frac/okapi as ok

// ─── Minting Policy ───────────────────────────────────────────────────────────

pub type MintAction {
  action: Int,
  // 1 = Mint, any other = Burn
  amount: Int,
  // number of fractional tokens to mint/burn
  token_name: ByteArray,
  // base token name (e.g. "FTOIC01")
}

pub type TokenDatum {
  metadata: Pairs<ByteArray, Data>,
  version: Int,
}

validator fraction_minting(owner: VerificationKeyHash) {
  mint(r: MintAction, policy_id: PolicyId, transaction: Transaction) {
    let Transaction { mint, outputs, .. } = transaction

    expect [
      Pair(ref_asset_name, ref_amount), Pair(frac_asset_name, frac_amount),
    ] =
      mint
        |> assets.tokens(policy_id)
        |> dict.to_pairs()

    expect ok.tx_signed_by(transaction, owner)

    when r.action is {
      1 -> {
        expect
          list.any(
            outputs,
            fn(output) {
              expect InlineDatum(datum) = output.datum
              expect _datum: TokenDatum = datum
              assets.quantity_of(output.value, policy_id, ref_asset_name) == 1
            },
          )
        expect
          list.any(
            outputs,
            fn(output) {
              assets.quantity_of(output.value, policy_id, frac_asset_name) == r.amount
            },
          )
        let token_name_list = ok.fraction_token_prefix(r.token_name)
        let ref_tn_check =
          ok.compare_token_names(ref_asset_name, list.at(token_name_list, 0))
        let frac_tn_check =
          ok.compare_token_names(frac_asset_name, list.at(token_name_list, 1))
        ref_amount == 1 && frac_amount == r.amount && ref_tn_check && frac_tn_check
      }
      _ -> {
        let token_name_list = ok.fraction_token_prefix(r.token_name)
        let ref_tn_check =
          ok.compare_token_names(ref_asset_name, list.at(token_name_list, 0))
        let frac_tn_check =
          ok.compare_token_names(frac_asset_name, list.at(token_name_list, 1))
        ref_amount == -1 && frac_amount == -r.amount && ref_tn_check && frac_tn_check
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



