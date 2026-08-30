'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useCardano } from '@/components/Providers'

export interface UseDepositViewReturn {
	address: string | null
	copied: boolean
	handleCopy: () => void
}

export function useDepositView(): UseDepositViewReturn {
	const { address } = useCardano()
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		if (address) {
			navigator.clipboard.writeText(address)
			setCopied(true)
			toast.success('Address copied to clipboard')
			setTimeout(() => setCopied(false), 2000)
		}
	}

	return { address, copied, handleCopy }
}
