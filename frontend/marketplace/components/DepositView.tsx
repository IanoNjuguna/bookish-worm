'use client'

import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { IconCopy, IconCheck, IconWallet, IconExternalLink } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useAudio } from '@/components/AudioProvider'
import { useCardano } from '@/components/Providers'
import { EXPLORER_URL } from '@/lib/config'

export function DepositView() {
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

	if (!address) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
				<IconWallet className="w-16 h-16 text-midnight/50 dark:text-white/20 mb-4" />
				<h2 className="text-xl font-bold text-midnight dark:text-white mb-2">Connect your wallet</h2>
				<p className="text-midnight/60 dark:text-white/60">Please connect your wallet to view your deposit address.</p>
			</div>
		)
	}

	const truncatedAddress = address.length > 19 ? `${address.slice(0, 10)}...${address.slice(-9)}` : address

	return (
		<div className="max-w-md mx-auto animate-fade-in">
			<div className="glass p-8 relative overflow-hidden text-center space-y-8 bg-[#FAF9F6] dark:bg-[#0D0D12]/80 border border-midnight/10 dark:border-white/10">
				<div className="relative flex justify-center">
					<div className="p-4 bg-midnight/5 dark:bg-white/[0.03] border border-midnight/10 dark:border-white/10 rounded-none relative">
						<div className="bg-[#0D0D12] p-4 overflow-hidden shadow-[0_0_30px_rgba(183,148,244,0.1)] border border-midnight/10 dark:border-white/5 rounded-none">
							<QRCodeSVG
								value={address}
								size={220}
								bgColor="#0D0D12"
								fgColor="#B794F4"
								level="H"
								includeMargin={false}
								imageSettings={{
									src: "/doba.png",
									height: 48,
									width: 48,
									excavate: true,
								}}
							/>
						</div>
					</div>
				</div>

				{/* Address Section */}
				<div className="space-y-4 flex flex-col items-center">
					<div
						onClick={handleCopy}
						className="group flex items-center justify-center gap-4 p-4 bg-midnight/5 dark:bg-black/40 border border-midnight/10 dark:border-white/10 hover:border-midnight/20 dark:border-white/20 transition-all cursor-pointer overflow-hidden rounded-none w-full"
					>
						<code className="text-[13px] font-mono text-midnight/80 dark:text-white/80 select-all break-all">
							{address}
						</code>
						<div className="flex items-center gap-2">
							<div className="flex-shrink-0">
								{copied ? (
									<IconCheck className="w-4 h-4 text-green-400" />
								) : (
									<IconCopy className="w-4 h-4 text-midnight/70 dark:text-white/40 group-hover:text-midnight dark:hover:text-white transition-colors" />
								)}
							</div>
							<a
								href={`${EXPLORER_URL}/address/${address}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-shrink-0 text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white transition-colors"
								onClick={(e) => e.stopPropagation()}
								title="View on CardanoScan"
							>
								<IconExternalLink className="w-4 h-4" />
							</a>
						</div>
					</div>

					<div className="flex items-center justify-center gap-2">
						<span className="text-xs font-mono font-bold tracking-wider text-[#FF1F8A]">CARDANO PREPROD NETWORK</span>
					</div>
				</div>
			</div>

			{/* Decorative Elements */}
			<div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] pointer-events-none"></div>
			<div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 blur-[60px] pointer-events-none"></div>
		</div>
	)
}

export default DepositView
