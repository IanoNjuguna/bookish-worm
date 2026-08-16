'use client'

import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { IconCopy, IconCheck, IconWallet, IconExternalLink } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useAudio } from '@/components/AudioProvider'
import { useCardano } from '@/components/Providers'
import { EXPLORER_URL, CARDANO_NETWORK } from '@/lib/config'

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

	return (
		<div className="relative text-center space-y-6">
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

				{/* Address Section */}
				<div className="space-y-4">
					<div className="flex items-center justify-center gap-2">
						<span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-600 dark:text-cyber-pink">
							Cardano {CARDANO_NETWORK.toUpperCase()} Network
						</span>
					</div>

					<button
						onClick={handleCopy}
						className="group w-full flex items-center justify-between gap-3 p-3 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 hover:border-midnight/20 dark:hover:border-white/20 transition-all rounded-xl"
					>
						<code className="text-xs sm:text-sm font-mono text-midnight/80 dark:text-white/80 select-all break-all text-left">
							{address}
						</code>
						<div className="flex items-center gap-1 shrink-0">
							<div className="w-8 h-8 flex items-center justify-center rounded-lg text-midnight/60 dark:text-white/40 group-hover:text-midnight dark:group-hover:text-white group-hover:bg-midnight/5 dark:group-hover:bg-white/5 transition-colors">
								{copied ? <IconCheck size={16} className="text-emerald-500" /> : <IconCopy size={16} />}
							</div>
							<a
								href={`${EXPLORER_URL}/address/${address}`}
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 flex items-center justify-center rounded-lg text-midnight/60 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors"
								onClick={(e) => e.stopPropagation()}
								title="View on CardanoScan"
							>
								<IconExternalLink size={16} />
							</a>
						</div>
					</button>
				</div>
			</div>
	)
}

export default DepositView
