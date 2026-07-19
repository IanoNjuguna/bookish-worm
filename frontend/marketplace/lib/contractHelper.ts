import blueprint from "@/contracts/plutus.json" with { type: "json" };
import { CARDANO_NETWORK, TREASURY_ADDRESS, FEE_BPS } from "./config";

export interface AlbumTrackMintData {
	name: string;
	audioUrl: string;
	duration?: string;
}

export interface TrackMintData {
	token_id: number;
	ticker?: string;
	name: string;
	artist: string;
	description?: string;
	imageUrl: string;
	audioUrl: string;
	price: string;
	supply: string;
	duration?: string;
	isAlbum?: boolean;
	tracks?: AlbumTrackMintData[];
	royaltyRate?: string;
	royaltyAddress?: string;
}

export function isUserDeclinedTxError(error: unknown): boolean {
	const lower = String((error as any)?.message || error || '').toLowerCase();
	return (
		lower.includes('user declined sign tx') ||
		lower.includes('user declined') ||
		lower.includes('user rejected') ||
		lower.includes('user denied') ||
		lower.includes('declined transaction') ||
		lower.includes('rejected transaction') ||
		lower.includes('declined to sign') ||
		lower.includes('cancelled') ||
		lower.includes('canceled')
	);
}

/**
 * Derives the policy ID, locking address, and distribution address for a given creator address.
 */
export async function getContractAddresses(creatorAddress: string) {
	const { paymentCredentialOf, applyParamsToScript, applyDoubleCborEncoding, mintingPolicyToId, validatorToAddress, getAddressDetails, Constr } = await import("@lucid-evolution/lucid");

	const ownerPKH = paymentCredentialOf(creatorAddress).hash;

	// 1. Minting Policy
	const mintValidator = blueprint.validators.find((v: any) => v.title === "frac.fraction_minting.mint");
	if (!mintValidator) throw new Error("frac.fraction_minting.mint validator not found in blueprint");
	const mintScript = {
		type: "PlutusV3" as const,
		script: applyParamsToScript(applyDoubleCborEncoding(mintValidator.compiledCode), [ownerPKH]),
	};
	const mintCS = mintingPolicyToId(mintScript);

	// 2. Locking Validator (keeps reference token)
	const lockValidator = blueprint.validators.find((v: any) => v.title === "frac.locking.spend");
	if (!lockValidator) throw new Error("frac.locking.spend validator not found in blueprint");
	const lockScript = {
		type: "PlutusV3" as const,
		script: applyParamsToScript(applyDoubleCborEncoding(lockValidator.compiledCode), [ownerPKH, mintCS]),
	};
	const lAddress = validatorToAddress(CARDANO_NETWORK, lockScript);

	// 3. Distribution Validator (keeps fractional tokens for sale)
	const distroValidator = blueprint.validators.find((v: any) => v.title === "frac.distribution.spend");
	if (!distroValidator) throw new Error("frac.distribution.spend validator not found in blueprint");

	// Convert treasury Bech32 address to Plutus Address schema
	if (!TREASURY_ADDRESS) throw new Error("Treasury address is not configured");
	const { paymentCredential, stakeCredential } = getAddressDetails(TREASURY_ADDRESS);
	if (!paymentCredential) throw new Error("Invalid treasury address configuration");

	const payCredPlutus = new Constr(paymentCredential.type === "Key" ? 0 : 1, [paymentCredential.hash]);

	let stakeCredPlutus;
	if (stakeCredential) {
		const stakeInline = new Constr(0, [
			new Constr(stakeCredential.type === "Key" ? 0 : 1, [stakeCredential.hash])
		]);
		stakeCredPlutus = new Constr(0, [stakeInline]);
	} else {
		stakeCredPlutus = new Constr(1, []); // None
	}

	const treasuryAddressPlutus = new Constr(0, [payCredPlutus, stakeCredPlutus]);

	const distroScript = {
		type: "PlutusV3" as const,
		script: applyParamsToScript(applyDoubleCborEncoding(distroValidator.compiledCode), [
			ownerPKH,
			treasuryAddressPlutus,
			FEE_BPS
		]),
	};
	const dAddress = validatorToAddress(CARDANO_NETWORK, distroScript);

	return {
		mintScript,
		mintCS,
		lockScript,
		lAddress,
		distroScript,
		dAddress,
		ownerPKH,
	};
}

/**
 * Constructs the CIP-60 version 3 metadata datum for the reference token (Label 100).
 */
export async function buildCIP60MetadataDatum(track: TrackMintData, fallbackAddress?: string) {
	const { Data, Constr, fromText } = await import("@lucid-evolution/lucid");

	const artist = new Map<any, any>();
	artist.set(fromText("name"), fromText(track.artist));

	const releaseData = new Map<any, any>();
	releaseData.set(fromText("release_title"), fromText(track.name));
	releaseData.set(fromText("release_type"), fromText(track.isAlbum ? "Album" : "Single"));

	let fileList = [];

	if (track.isAlbum && Array.isArray(track.tracks)) {
		fileList = track.tracks.map((t, idx) => {
			const songData = new Map<any, any>();
			songData.set(fromText("song_title"), fromText(t.name));
			songData.set(fromText("song_duration"), fromText(t.duration || "PT3M45S"));
			songData.set(fromText("track_number"), BigInt(idx + 1));
			songData.set(fromText("artists"), [artist]);

			const fileData = new Map<any, any>();
			fileData.set(fromText("name"), fromText(`${t.name} Audio`));
			fileData.set(fromText("mediaType"), fromText("audio/mpeg"));
			fileData.set(fromText("src"), fromText(t.audioUrl));
			fileData.set(fromText("song"), songData);

			return fileData;
		});
	} else {
		const songData = new Map<any, any>();
		songData.set(fromText("song_title"), fromText(track.name));
		songData.set(fromText("song_duration"), fromText(track.duration || "PT3M45S"));
		songData.set(fromText("track_number"), 1n);
		songData.set(fromText("artists"), [artist]);

		const fileData = new Map<any, any>();
		fileData.set(fromText("name"), fromText(`${track.name} Audio`));
		fileData.set(fromText("mediaType"), fromText("audio/mpeg"));
		fileData.set(fromText("src"), fromText(track.audioUrl));
		fileData.set(fromText("song"), songData);

		fileList = [fileData];
	}

	const metadata = new Map<any, any>();
	metadata.set(fromText("name"), fromText(track.name));
	if (track.ticker) {
		metadata.set(fromText("ticker"), fromText(track.ticker));
	}
	metadata.set(fromText("description"), fromText(track.description || ""));
	metadata.set(fromText("image"), fromText(track.imageUrl));
	metadata.set(fromText("music_metadata_version"), 3n);
	metadata.set(fromText("release"), releaseData);
	metadata.set(fromText("files"), fileList);

	const rate = track.royaltyRate !== undefined && track.royaltyRate !== null ? track.royaltyRate : "0.05";
	const address = track.royaltyAddress || fallbackAddress || "";
	if (rate) {
		metadata.set(fromText("royalty_rate"), fromText(rate));
	}
	if (address) {
		metadata.set(fromText("royalty_address"), fromText(address));
	}

	// Constr 0 represents TokenDatum { metadata: Pairs<ByteArray, Data>, version: Int }
	return Data.to(new Constr(0, [metadata, 1n]));
}

/**
 * Builds and submits a transaction that mints the track assets (1 Ref token, N Fractions),
 * locks the Ref token at the locking validator, and locks the Fractions at the distribution validator.
 */
export async function mintTrackOnChain(lucid: any, track: TrackMintData): Promise<{ txHash: string; policyId: string }> {
	if (!lucid) throw new Error("Wallet not connected");

	const { Data, Constr, fromText, toUnit } = await import("@lucid-evolution/lucid");

	const creatorAddress = await lucid.wallet().address();
	const { mintScript, mintCS, lAddress, dAddress, ownerPKH } = await getContractAddresses(creatorAddress);

	// Use custom ticker if provided, otherwise fallback to deterministic token name based on token_id
	const tokenNameStr = track.ticker
		? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
		: "T" + String(track.token_id).slice(-11);
	const tokenName = fromText(tokenNameStr);

	// Redeemers
	const mintRedeemer = Data.to(new Constr(0, [1n, BigInt(track.supply), tokenName]));

	// Datums
	const lDatum = await buildCIP60MetadataDatum(track, creatorAddress);
	const priceLovelace = track.price ? BigInt(Math.floor(parseFloat(track.price) * 1000000)) : 420n;
	const dDatum = Data.to(new Constr(0, [priceLovelace])); // Standard pool datum

	// Units
	const refUnit = toUnit(mintCS, tokenName, 100);
	const fracUnit = toUnit(mintCS, tokenName, 444);

	const tx = await lucid
		.newTx()
		.mintAssets({
			[refUnit]: 1n,
			[fracUnit]: BigInt(track.supply)
		}, mintRedeemer)
		.attach.MintingPolicy(mintScript)
		.pay.ToContract(lAddress, { kind: "inline", value: lDatum }, { [refUnit]: 1n })
		.pay.ToContract(dAddress, { kind: "inline", value: dDatum }, { [fracUnit]: BigInt(track.supply) })
		.addSignerKey(ownerPKH)
		.complete();

	const signedTx = await tx.sign.withWallet().complete();
	const txHash = await signedTx.submit();

	return { txHash, policyId: mintCS };
}

/**
 * Builds and submits a transaction that claims 1 fractional token from the distribution contract.
 */
export async function buyFractionOnChain(
	lucid: any,
	track: { token_id: number; uploader_address: string; album_id?: number | null; ticker?: string }
): Promise<string> {
	if (!lucid) throw new Error("Wallet not connected");

	const { Data, Constr, fromText, toUnit } = await import("@lucid-evolution/lucid");

	const buyerAddress = await lucid.wallet().address();
	console.log("[DEBUG buyFractionOnChain] track.uploader_address:", track.uploader_address);

	// Guard: reject stake addresses – they cannot be used to derive contract parameters.
	// The caller must provide the creator's payment address (addr_test1... / addr1...).
	if (track.uploader_address.startsWith("stake")) {
		throw new Error(
			"Cannot derive contract address from a stake address. " +
			"Please try again — the creator's payment address is still loading."
		);
	}

	const { dAddress, distroScript, mintCS } = await getContractAddresses(track.uploader_address);
	console.log("[DEBUG buyFractionOnChain] derived dAddress:", dAddress);

	const targetTokenId = track.album_id ? track.album_id : track.token_id;
	const tokenNameStr = track.ticker
		? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
		: "T" + String(targetTokenId).slice(-11);
	const tokenName = fromText(tokenNameStr);
	const fracUnit = toUnit(mintCS, tokenName, 444);
	console.log("[DEBUG buyFractionOnChain] fracUnit:", fracUnit);

	// Locate UTXOs locked at the distribution script holding the fractional tokens.
	// utxosAtWithUnit can return [] in some Blockfrost edge-cases (e.g. timeout / provider quirk),
	// so we fall back to a full utxosAt + manual filter before giving up.
	let utxos = await lucid.utxosAtWithUnit(dAddress, fracUnit);
	console.log("[DEBUG buyFractionOnChain] utxosAtWithUnit result:", utxos);

	if (!utxos || utxos.length === 0) {
		console.warn("[DEBUG buyFractionOnChain] utxosAtWithUnit returned empty – falling back to utxosAt + filter");
		const allUtxos = await lucid.utxosAt(dAddress);
		console.log("[DEBUG buyFractionOnChain] utxosAt (all) result:", allUtxos);
		utxos = allUtxos.filter((u: any) => u.assets && u.assets[fracUnit] > 0n);
		console.log("[DEBUG buyFractionOnChain] filtered utxos:", utxos);
	}

	if (!utxos || utxos.length === 0) {
		throw new Error(`No available fractions left for sale in the distribution contract. (Queried address: ${dAddress}, unit: ${fracUnit})`);
	}

	const utxo = utxos[0];
	const currentBalance = utxo.assets[fracUnit];
	if (currentBalance <= 0n) {
		throw new Error("Distribution script is out of stock.");
	}

	const remainingBalance = currentBalance - 1n;

	// Redeemer for spending from distribution script (1n = Buy/Claim)
	const spendRedeemer = Data.to(new Constr(0, [1n, 0n]));

	// Parse actual price from the UTXO datum
	let priceLovelace = 420n;
	if (utxo.datum) {
		try {
			const decoded = Data.from(utxo.datum);
			if (decoded && typeof decoded === "object" && "fields" in decoded) {
				const fields = (decoded as any).fields;
				if (fields && fields.length > 0 && typeof fields[0] === "bigint") {
					priceLovelace = fields[0];
				}
			}
		} catch (e) {
			console.warn("Failed to parse datum price:", e);
		}
	}

	const dDatum = Data.to(new Constr(0, [priceLovelace]));

	// Calculate fee payment (minimum 1 ADA/1,000,000 lovelace to satisfy Cardano min UTXO requirement)
	const fee = (priceLovelace * FEE_BPS) / 10000n;
	const feeLovelace = fee > 1000000n ? fee : 1000000n;
	const creatorLovelace = priceLovelace - fee;

	let tx = lucid
		.newTx()
		.collectFrom([utxo], spendRedeemer)
		.attach.SpendingValidator(distroScript)
		.pay.ToAddress(buyerAddress, { [fracUnit]: 1n })
		.pay.ToAddress(track.uploader_address, { lovelace: creatorLovelace })
		.pay.ToAddress(TREASURY_ADDRESS, { lovelace: feeLovelace });

	// If there are remaining fractions, return them back to the distribution script
	if (remainingBalance > 0n) {
		tx = tx.pay.ToContract(dAddress, { kind: "inline", value: dDatum }, { [fracUnit]: remainingBalance });
	}

	const completedTx = await tx.complete();
	const signedTx = await completedTx.sign.withWallet().complete();
	const txHash = await signedTx.submit();

	return txHash;
}

/**
 * Builds and submits a transaction that claims 1 fractional token for multiple track assets at once.
 */
export async function buyAlbumFractionsOnChain(
	lucid: any,
	tracksToMint: { token_id: number; uploader_address: string; ticker?: string; price?: string }[]
): Promise<string> {
	if (!lucid) throw new Error("Wallet not connected");

	const { Data, Constr, fromText, toUnit } = await import("@lucid-evolution/lucid");

	const buyerAddress = await lucid.wallet().address();
	let tx = lucid.newTx();
	let totalFeeLovelace = 0n;
	const payoutsByCreator = new Map<string, bigint>();

	for (const track of tracksToMint) {
		if (track.uploader_address.startsWith("stake")) {
			throw new Error(
				"Cannot derive contract address from a stake address. " +
				"Please try again — the creator's payment address is still loading."
			);
		}

		const { dAddress, distroScript, mintCS } = await getContractAddresses(track.uploader_address);

		const tokenNameStr = track.ticker
			? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
			: "T" + String(track.token_id).slice(-11);
		const tokenName = fromText(tokenNameStr);
		const fracUnit = toUnit(mintCS, tokenName, 444);

		let utxos = await lucid.utxosAtWithUnit(dAddress, fracUnit);
		if (!utxos || utxos.length === 0) {
			const allUtxos = await lucid.utxosAt(dAddress);
			utxos = allUtxos.filter((u: any) => u.assets && u.assets[fracUnit] > 0n);
		}

		if (!utxos || utxos.length === 0) {
			throw new Error(`No available fractions left for track ID ${track.token_id}.`);
		}

		const utxo = utxos[0];
		const currentBalance = utxo.assets[fracUnit];
		if (currentBalance <= 0n) {
			throw new Error(`Track ID ${track.token_id} is out of stock.`);
		}

		const remainingBalance = currentBalance - 1n;
		const spendRedeemer = Data.to(new Constr(0, [1n, 0n]));

		let priceLovelace = track.price ? BigInt(Math.floor(parseFloat(track.price) * 1000000)) : 5000000n;
		if (utxo.datum) {
			try {
				const decoded = Data.from(utxo.datum);
				if (decoded && typeof decoded === "object" && "fields" in decoded) {
					const fields = (decoded as any).fields;
					if (fields && fields.length > 0 && typeof fields[0] === "bigint") {
						priceLovelace = fields[0];
					}
				}
			} catch (e) {
				console.warn("Failed to parse datum price:", e);
			}
		}

		const dDatum = Data.to(new Constr(0, [priceLovelace]));
		const fee = (priceLovelace * BigInt(FEE_BPS)) / 10000n;
		const feeLovelace = fee > 1000000n ? fee : 1000000n;
		const creatorLovelace = priceLovelace - fee;

		totalFeeLovelace += feeLovelace;
		payoutsByCreator.set(
			track.uploader_address,
			(payoutsByCreator.get(track.uploader_address) || 0n) + creatorLovelace
		);

		tx = tx
			.collectFrom([utxo], spendRedeemer)
			.attach.SpendingValidator(distroScript)
			.pay.ToAddress(buyerAddress, { [fracUnit]: 1n });

		if (remainingBalance > 0n) {
			tx = tx.pay.ToContract(dAddress, { kind: "inline", value: dDatum }, { [fracUnit]: remainingBalance });
		}
	}

	for (const [creatorAddress, lovelace] of payoutsByCreator.entries()) {
		tx = tx.pay.ToAddress(creatorAddress, { lovelace });
	}

	if (totalFeeLovelace > 0n) {
		tx = tx.pay.ToAddress(TREASURY_ADDRESS, { lovelace: totalFeeLovelace });
	}

	const completedTx = await tx.complete();
	const signedTx = await completedTx.sign.withWallet().complete();
	const txHash = await signedTx.submit();

	return txHash;
}

/**
 * Formats blockchain and wallet transaction errors into clean, user-friendly messages.
 */
export function formatTxError(error: any): string {
	const errorString = String(error?.message || error || "").toLowerCase();
	
	if (
		errorString.includes("utxobalanceinsufficient") || 
		errorString.includes("insufficientutxobalance") || 
		errorString.includes("insufficient balance") || 
		errorString.includes("not enough funds") || 
		errorString.includes("lovelace")
	) {
		return "Insufficient funds! Your wallet does not have enough ADA to cover transaction fees and on-chain UTxO storage deposits.";
	}
	
	if (isUserDeclinedTxError(error)) {
		return "You declined the transaction.";
	}

	if (
		errorString.includes("all inputs are spent") || 
		errorString.includes("inputs are spent") ||
		errorString.includes("already been included")
	) {
		return "A previous transaction is still pending. Please wait ~20 seconds for the blockchain to confirm it before collecting again.";
	}
	
	// Default to error message or generic string fallback
	return error?.message || "An unexpected transaction error occurred.";
}
