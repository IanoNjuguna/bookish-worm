'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useCardano } from '@/components/Providers'
import { toast } from 'sonner'

const API_URL = '/api-backend'
const REFRESH_BUFFER_MS = 60_000 // Refresh 1 minute before expiry

interface AuthData {
	accessToken: string;
	address: string;
	expiresAt: number; // timestamp in ms
}

export function useBackendAuth() {
	const { address: cardanoAddress, stakeAddress, walletName, isConnected, walletApi, lucid } = useCardano()
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [preloadedNonce, setPreloadedNonce] = useState<string | null>(null)
	const [nonceTimestamp, setNonceTimestamp] = useState<number | null>(null)
	const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const effectiveAddress = stakeAddress || cardanoAddress

	// Preload nonce to bypass popup blockers for social auth (keeps user gesture intact)
	useEffect(() => {
		if (effectiveAddress && !isAuthenticated) {
			fetch(`${API_URL}/auth/challenge?address=${encodeURIComponent(effectiveAddress)}`)
				.then(res => {
					if (!res.ok) throw new Error('Failed to fetch challenge')
					return res.json()
				})
				.then(data => {
					if (data && data.nonce) {
						setPreloadedNonce(data.nonce)
						setNonceTimestamp(Date.now())
					}
				})
				.catch(() => {})
		}
	}, [effectiveAddress, isAuthenticated])

	// Schedule a silent refresh before the access token expires
	const scheduleRefresh = useCallback((expiresAt: number) => {
		if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)

		const msUntilRefresh = expiresAt - Date.now() - REFRESH_BUFFER_MS
		if (msUntilRefresh <= 0) {
			// Already expired or about to — refresh immediately
			refreshSession()
			return
		}

		refreshTimerRef.current = setTimeout(() => {
			refreshSession()
		}, msUntilRefresh)
	}, [])

	const logout = useCallback(() => {
		if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
		setAccessToken(null)
		setIsAuthenticated(false)
		if (typeof window !== 'undefined') {
			localStorage.removeItem('doba_auth_data')
		}
		// Tell the server to clear its HttpOnly cookie
		fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
	}, [])

	const refreshSession = useCallback(async (): Promise<string | null> => {
		try {
			const res = await fetch(`${API_URL}/auth/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include', // Send HttpOnly cookie
			})

			if (!res.ok) {
				logout()
				return null
			}

			const data = await res.json()
			const expiresIn = data.expiresIn || 15 * 60 // Default 15 min
			const expiresAt = Date.now() + expiresIn * 1000

			const newAuthData: AuthData = {
				accessToken: data.accessToken,
				address: data.address || effectiveAddress || '',
				expiresAt
			}

			localStorage.setItem('doba_auth_data', JSON.stringify(newAuthData))
			setAccessToken(data.accessToken)
			setIsAuthenticated(true)

			// Schedule the next refresh
			scheduleRefresh(expiresAt)

			return data.accessToken
		} catch (err) {
			console.error('Failed to refresh session:', err)
			logout()
			return null
		}
	}, [logout, effectiveAddress, scheduleRefresh])

	const [isCheckingAuth, setIsCheckingAuth] = useState(true)

	// Load stored auth on mount and schedule refresh
	useEffect(() => {
		if (typeof window === 'undefined') return
		const stored = localStorage.getItem('doba_auth_data')
		if (stored) {
			try {
				const data: AuthData = JSON.parse(stored)
				// If a wallet is connected, verify it matches the stored address
				if (effectiveAddress) {
					if (data.address === effectiveAddress) {
						if (Date.now() < data.expiresAt - REFRESH_BUFFER_MS) {
							setAccessToken(data.accessToken)
							setIsAuthenticated(true)
							scheduleRefresh(data.expiresAt)
							setIsCheckingAuth(false)
						} else {
							refreshSession().finally(() => setIsCheckingAuth(false))
						}
					} else {
						// Address mismatch, clear auth
						localStorage.removeItem('doba_auth_data')
						setIsCheckingAuth(false)
					}
				} else {
					// No wallet connected yet, but we have stored credentials.
					// Keep them in state and schedule refresh to keep session alive.
					if (Date.now() < data.expiresAt - REFRESH_BUFFER_MS) {
						setAccessToken(data.accessToken)
						setIsAuthenticated(true)
						scheduleRefresh(data.expiresAt)
						setIsCheckingAuth(false)
					} else {
						refreshSession().finally(() => setIsCheckingAuth(false))
					}
				}
			} catch (e) {
				localStorage.removeItem('doba_auth_data')
				setIsCheckingAuth(false)
			}
		} else {
			setIsCheckingAuth(false)
		}
	}, [effectiveAddress, refreshSession, scheduleRefresh])

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
		}
	}, [])

	const resolveSignerApi = useCallback(async (): Promise<any | null> => {
		if (walletApi && typeof walletApi.signData === 'function') {
			return walletApi
		}

		// Seed/test-mode wallet fallback (no CIP-30 extension available)
		if (walletName === 'utxos' && lucid) {
			const selectedWallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet
			if (selectedWallet && typeof selectedWallet.signMessage === 'function') {
				return {
					signData: async (address: string, payload: string) => selectedWallet.signMessage(address, payload)
				}
			}
		}

		// Extension reconnect fallback in case context signer wasn't hydrated yet
		if (walletName && walletName !== 'utxos' && typeof window !== 'undefined') {
			try {
				const cardanoProvider = (window as any).cardano
				const provider = cardanoProvider?.[walletName]
				if (provider && typeof provider.enable === 'function') {
					const api = await provider.enable()
					if (api && typeof api.signData === 'function') {
						return api
					}
				}
			} catch {
				// Ignore and allow caller to surface a user-friendly message.
			}
		}

		return null
	}, [walletApi, walletName, lucid])

	const login = useCallback(async function loginFn(isRetry = false): Promise<string | null> {
		if (!isConnected || !effectiveAddress) {
			toast.error('Please connect your Cardano wallet first')
			return null
		}

		const signerApi = await resolveSignerApi()
		if (!signerApi) {
			toast.error('Wallet signer not ready. Please reconnect and try again.')
			return null
		}

		setIsLoading(true)

		let nonce = preloadedNonce
		const isExpired = nonceTimestamp && (Date.now() - nonceTimestamp > 4 * 60 * 1000) // 4 minutes
		if (!nonce || isExpired) {
			try {
				const res = await fetch(`${API_URL}/auth/challenge?address=${encodeURIComponent(effectiveAddress)}`)
				if (!res.ok) {
					const errData = await res.json().catch(() => ({}))
					throw new Error(errData.message || 'Failed to initialize secure session')
				}
				const data = await res.json()
				nonce = data.nonce
			} catch (err: any) {
				toast.error(err?.message || 'Failed to initialize secure session. Please try again.')
				setIsLoading(false)
				return null
			}
		}

		// Clear preloaded nonce so it's fresh for next time
		setPreloadedNonce(null)
		setNonceTimestamp(null)

		const timestamp = new Date().toISOString()
		const message = `Sign in to Doba Music\n\nBy signing this message, you agree to the Doba Terms of Service and Privacy Policy.\n\nAddress: ${effectiveAddress}\nNonce: ${nonce}\nTimestamp: ${timestamp}`
		
		const hexMessage = Array.from(new TextEncoder().encode(message))
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')

		try {
			const signatureResponse = await signerApi.signData(effectiveAddress, hexMessage)
			if (!signatureResponse?.signature || !signatureResponse?.key) {
				throw new Error('Wallet returned an invalid signature payload')
			}
			
			const res = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					address: effectiveAddress,
					signature: signatureResponse.signature,
					key: signatureResponse.key,
					message: message,
					nonce: nonce
				})
			})

			if (!res.ok) {
				const errData = await res.json()
				if (!isRetry && errData.message && errData.message.toLowerCase().includes('nonce')) {
					// Secure session expired during the process, refresh and retry
					toast.info('Secure session expired. Re-initiating authentication...')
					setIsLoading(false)
					return loginFn(true)
				}
				throw new Error(errData.message || 'Signature verification failed on backend')
			}

			const data = await res.json()
			const expiresIn = data.expiresIn || 15 * 60
			const expiresAt = Date.now() + expiresIn * 1000

			const authData: AuthData = {
				accessToken: data.accessToken,
				address: data.address,
				expiresAt
			}

			localStorage.setItem('doba_auth_data', JSON.stringify(authData))
			setAccessToken(data.accessToken)
			setIsAuthenticated(true)
			toast.success('Successfully authenticated!')

			scheduleRefresh(expiresAt)
			return data.accessToken
		} catch (error: any) {
			const errMessage = typeof error === 'string' ? error : (error?.message || '')
			if (errMessage.includes('UserDeclined') || errMessage.includes('User declined') || errMessage.includes('cancelled') || errMessage.includes('Refused')) {
				console.log('User cancelled signature request.')
				toast.info('Signature request cancelled')
			} else {
				console.error('Login error:', error)
				toast.error(errMessage || 'Authentication failed')
			}
			return null
		} finally {
			setIsLoading(false)
		}
	}, [isConnected, effectiveAddress, scheduleRefresh, preloadedNonce, nonceTimestamp, resolveSignerApi])

	const getValidToken = useCallback(async () => {
		if (typeof window === 'undefined') return null
		const stored = localStorage.getItem('doba_auth_data')
		if (!stored) return null

		try {
			const data: AuthData = JSON.parse(stored)
			if (data.address !== effectiveAddress) {
				logout()
				return null
			}

			// If token is expired or close to expiry, refresh it
			if (Date.now() >= data.expiresAt - REFRESH_BUFFER_MS) {
				return await refreshSession()
			}

			return data.accessToken
		} catch (e) {
			logout()
			return null
		}
	}, [effectiveAddress, refreshSession, logout])

	return {
		accessToken,
		login,
		getValidToken,
		logout,
		isLoading,
		isAuthenticated,
		isCheckingAuth,
		effectiveAddress
	}
}
