export interface Track {
	token_id: number
	name: string
	artist: string
	price: string
	max_supply: string
	mint_count?: number
	uploader_address: string
	image_url?: string
}

export interface Collaborator {
	wallet_address?: string
	split_percentage: number
}

export interface RoyaltyEntry {
	track: string
	tokenId: number
	price: string
	mintCount: number
	shares: number
	myEarnings: string
	uploaderAddress: string
	imageUrl?: string
}
