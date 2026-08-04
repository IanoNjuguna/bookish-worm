import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const unit = searchParams.get('unit')

	if (!unit) {
		return NextResponse.json({ logoUrl: null })
	}

	try {
		const registryRes = await fetch(
			`https://raw.githubusercontent.com/cardano-foundation/cardano-token-registry/master/mappings/${unit}.json`,
			{ next: { revalidate: 3600 } }
		)
		if (registryRes.ok) {
			const regData = await registryRes.json()
			if (regData?.logo?.value) {
				return NextResponse.json({
					logoUrl: `data:image/png;base64,${regData.logo.value}`
				})
			}
		}
	} catch (e) {
		// Server-side network error handling
	}

	return NextResponse.json({ logoUrl: null })
}
