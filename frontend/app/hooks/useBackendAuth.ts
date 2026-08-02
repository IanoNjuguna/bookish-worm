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
	const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const effectiveAddress = cardanoAddress || stakeAddress

	// Schedule a silent refresh before the access token expires
	const scheduleRefresh = useCallback((data: AuthData) => {
		if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)

		const timeUntilRefresh = data.expiresAt - Date.now() - REFRESH_BUFFER_MS

		if (timeUntilRefresh <= 0) {
			refreshSession()
			return
		}

		refreshTimerRef.current = setTimeout(() => {
			refreshSession()
		}, timeUntilRefresh)
	}, [])

	// Silent session refresh using HTTP-only refresh token cookie
	const refreshSession = useCallback(async (): Promise<string | null> => {
		try {
			const res = await fetch(`${API_URL}/auth/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include'
			})

			if (!res.ok) {
				localStorage.removeItem('doba_auth_data')
				setAccessToken(null)
				setIsAuthenticated(false)
				return null
			}

			const data = await res.json()
			if (data.accessToken) {
				const expiresAt = data.expiresAt
					? new Date(data.expiresAt).getTime()
					: Date.now() + (data.expiresIn ? data.expiresIn * 1000 : 3600_000)

				const authData: AuthData = {
					accessToken: data.accessToken,
					address: data.address || effectiveAddress || '',
					expiresAt
				}

				localStorage.setItem('doba_auth_data', JSON.stringify(authData))
				setAccessToken(data.accessToken)
				setIsAuthenticated(true)
				scheduleRefresh(authData)
				return data.accessToken
			}
			return null
		} catch (err) {
			localStorage.removeItem('doba_auth_data')
			setAccessToken(null)
			setIsAuthenticated(false)
			return null
		}
	}, [effectiveAddress, scheduleRefresh])

	// Silent auth restoration from localStorage on mount & when wallet connects
	const [isCheckingAuth, setIsCheckingAuth] = useState(true)
	useEffect(() => {
		const stored = localStorage.getItem('doba_auth_data')
		if (stored) {
			try {
				const authData: AuthData = JSON.parse(stored)

				if (effectiveAddress && authData.address && authData.address.toLowerCase() !== effectiveAddress.toLowerCase()) {
					localStorage.removeItem('doba_auth_data')
					setAccessToken(null)
					setIsAuthenticated(false)
					setIsCheckingAuth(false)
					return
				}

				if (authData.expiresAt > Date.now() + REFRESH_BUFFER_MS) {
					setAccessToken(authData.accessToken)
					setIsAuthenticated(true)
					setIsCheckingAuth(false)
					scheduleRefresh(authData)
				} else if (authData.expiresAt > Date.now()) {
					refreshSession().finally(() => setIsCheckingAuth(false))
				} else {
					refreshSession().finally(() => setIsCheckingAuth(false))
				}
			} catch (e) {
				localStorage.removeItem('doba_auth_data')
				setIsCheckingAuth(false)
			}
		} else {
			setIsCheckingAuth(false)
		}
	}, [effectiveAddress, refreshSession, scheduleRefresh])

	useEffect(() => {
		return () => {
			if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
		}
	}, [])

	const login = useCallback(async function loginFn(isRetry = false): Promise<string | null> {
		if (!isConnected || !effectiveAddress) {
			toast.error('Please connect your Cardano wallet first')
			return null
		}

		setIsLoading(true)

		let nonce: string
		try {
			const res = await fetch(`${API_URL}/auth/challenge?address=${encodeURIComponent(effectiveAddress)}`)
			if (!res.ok) {
				if (res.status === 429) {
					throw new Error('Too many requests. Please wait a few seconds before trying again.')
				}
				const errData = await res.json().catch(() => ({}))
				const errorMsg = errData.message || errData.error || errData.detail || `Server returned ${res.status}`
				throw new Error(errorMsg)
			}
			const data = await res.json()
			nonce = data.nonce
		} catch (err: any) {
			toast.error(err?.message || 'Failed to initialize secure session. Please try again.')
			setIsLoading(false)
			return null
		}

		const timestamp = new Date().toISOString()
		const message = `Sign in to Doba Music\n\nBy signing this message, you agree to the Doba Terms of Service and Privacy Policy.\n\nAddress: ${effectiveAddress}\nNonce: ${nonce}\nTimestamp: ${timestamp}`
		
		const hexMessage = Array.from(new TextEncoder().encode(message))
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')

		try {
			let signatureResponse: { signature: string; key: string }
			if (walletApi && typeof walletApi.signData === 'function') {
				signatureResponse = await walletApi.signData(effectiveAddress, hexMessage)
			} else if (lucid) {
				const sig = await lucid.wallet().signMessage(hexMessage)
				signatureResponse = { signature: sig.signature, key: sig.key }
			} else {
				throw new Error('No active wallet API or Lucid instance available for signing.')
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
				if (res.status === 429) {
					throw new Error('Too many login attempts. Please wait a few seconds before trying again.')
				}
				const errData = await res.json().catch(() => ({}))
				if (!isRetry && errData.message && errData.message.toLowerCase().includes('nonce')) {
					toast.info('Secure session expired. Re-initiating authentication...')
					setIsLoading(false)
					return loginFn(true)
				}
				const errorMsg = errData.message || errData.error || errData.detail || `Login failed (${res.status})`
				throw new Error(errorMsg)
			}

			const data = await res.json()
			const expiresAt = data.expiresAt
				? new Date(data.expiresAt).getTime()
				: Date.now() + (data.expiresIn ? data.expiresIn * 1000 : 3600_000)

			const authData: AuthData = {
				accessToken: data.accessToken,
				address: data.address || effectiveAddress,
				expiresAt
			}

			localStorage.setItem('doba_auth_data', JSON.stringify(authData))
			setAccessToken(data.accessToken)
			setIsAuthenticated(true)
			setIsLoading(false)

			scheduleRefresh(authData)
			toast.success('Successfully authenticated!')
			return data.accessToken
		} catch (err: any) {
			console.error('Login error:', err)
			toast.error(err?.message || 'Authentication failed. Please try again.')
			setIsLoading(false)
			return null
		}
	}, [isConnected, walletApi, lucid, effectiveAddress, scheduleRefresh])

	const logoutFn = useCallback(async () => {
		try {
			await fetch(`${API_URL}/auth/logout`, {
				method: 'POST',
				credentials: 'include'
			})
		} catch (e) {}

		if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
		localStorage.removeItem('doba_auth_data')
		setAccessToken(null)
		setIsAuthenticated(false)
		toast.info('Signed out')
	}, [])

	const getValidToken = useCallback(async (): Promise<string | null> => {
		const stored = localStorage.getItem('doba_auth_data')
		if (stored) {
			try {
				const authData: AuthData = JSON.parse(stored)
				if (authData.expiresAt > Date.now() + REFRESH_BUFFER_MS) {
					return authData.accessToken
				}
			} catch (e) {}
		}
		return refreshSession()
	}, [refreshSession])

	return {
		accessToken,
		isLoading,
		isAuthenticated,
		isCheckingAuth,
		login,
		logout: logoutFn,
		getValidToken,
		effectiveAddress
	}
}
