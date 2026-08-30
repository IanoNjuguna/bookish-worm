'use client'

import React from 'react'
import { useDepositView } from './deposit-view/useDepositView'
import { DepositConnectWallet } from './deposit-view/DepositConnectWallet'
import { DepositQrCode } from './deposit-view/DepositQrCode'
import { DepositAddressSection } from './deposit-view/DepositAddressSection'

export function DepositView() {
	const { address, copied, handleCopy } = useDepositView()

	if (!address) {
		return <DepositConnectWallet />
	}

	return (
		<div className="relative text-center space-y-6">
			<DepositQrCode address={address} />

			{/* Address Section */}
			<DepositAddressSection address={address} copied={copied} onCopy={handleCopy} />
		</div>
	)
}

export default DepositView
