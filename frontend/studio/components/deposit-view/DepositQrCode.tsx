import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface DepositQrCodeProps {
	address: string
}

export function DepositQrCode({ address }: DepositQrCodeProps) {
	return (
		<div className="flex justify-center">
			<div className="p-3 bg-midnight/5 dark:bg-white/[0.03] border border-midnight/10 dark:border-white/10 rounded-2xl">
				<div className="bg-midnight p-3 rounded-xl">
					<QRCodeSVG
						value={address}
						size={200}
						bgColor="#0D0D12"
						fgColor="#B794F4"
						level="H"
						includeMargin={false}
						imageSettings={{
							src: "/doba.png",
							height: 44,
							width: 44,
							excavate: true,
						}}
					/>
				</div>
			</div>
		</div>
	)
}
