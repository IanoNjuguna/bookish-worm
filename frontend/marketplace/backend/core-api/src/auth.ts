import verifyDataSignature from '@cardano-foundation/cardano-verify-datasignature'
import { logger } from './lib/logger'

const ACCESS_TOKEN_EXP = 15 * 60 // 15 minutes in seconds

export async function signJWT(payload: any, secret: string) {
	const { sign } = await import('hono/jwt')
	return await sign(payload, secret, 'HS256')
}

export async function verifyJWT(token: string, secret: string) {
	const { verify } = await import('hono/jwt')
	try {
		return await verify(token, secret, 'HS256')
	} catch (e) {
		return null
	}
}

export async function verifyWalletSignature(address: string, signature: string, key: string, message: string): Promise<boolean> {
	try {
		const valid = verifyDataSignature(signature, key, message, address)
		return !!valid
	} catch (error) {
		logger.error('Signature verification failed', error)
		return false
	}
}

export function generateRefreshToken() {
	return crypto.randomUUID()
}

export function getAccessTokenPayload(address: string) {
	const now = Math.floor(Date.now() / 1000)
	return {
		sub: address,
		iat: now,
		exp: now + ACCESS_TOKEN_EXP
	}
}

