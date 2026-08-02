module.exports = [
"[project]/components/AssetsView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AssetsView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Providers.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconMusic$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconMusic$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconMusic.mjs [app-ssr] (ecmascript) <export default as IconMusic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconCoins$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconCoins$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconCoins.mjs [app-ssr] (ecmascript) <export default as IconCoins>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPhoto$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPhoto$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconPhoto.mjs [app-ssr] (ecmascript) <export default as IconPhoto>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconWallet$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconWallet$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconWallet.mjs [app-ssr] (ecmascript) <export default as IconWallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$DobaVisualizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/DobaVisualizer.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
// Known token registry with fallbacks for decals and prices
const KNOWN_TOKENS = {
    "doba": {
        symbol: "DOBA",
        decimals: 0,
        price: 0.05,
        name: "Doba Ecosystem Token"
    },
    "usdc": {
        symbol: "USDC",
        decimals: 6,
        price: 1.00,
        name: "USD Coin (Bridge Asset)",
        fallbackLogo: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"
    },
    "hosky": {
        symbol: "HOSKY",
        decimals: 0,
        price: 0.00000096,
        name: "Hosky Meme Coin",
        fallbackLogo: "https://assets.coingecko.com/coins/images/22812/large/hosky.png"
    }
};
// Decode hex asset names to UTF-8 strings
function hexToString(hex) {
    try {
        let str = '';
        for(let i = 0; i < hex.length; i += 2){
            const charCode = parseInt(hex.substring(i, i + 2), 16);
            if (charCode >= 32 && charCode <= 126) {
                str += String.fromCharCode(charCode);
            }
        }
        return str || hex;
    } catch (e) {
        return hex;
    }
}
function AssetsView() {
    const { address, isConnected, lucid } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCardano"])();
    const [adaBalance, setAdaBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [adaPrice, setAdaPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0.38);
    const [customTokens, setCustomTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [ownedNfts, setOwnedNfts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('tokens');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchRegistryLogos(tokensList) {
            try {
                const updatedTokens = await Promise.all(tokensList.map(async (token)=>{
                    // Skip registry check for DOBA or tokens that already have fallback logos
                    if (token.symbol.toLowerCase() === 'doba' || token.logoUrl) {
                        return token;
                    }
                    try {
                        const registryRes = await fetch(`https://raw.githubusercontent.com/cardano-foundation/cardano-token-registry/master/mappings/${token.unit}.json`);
                        if (registryRes.ok) {
                            const regData = await registryRes.json();
                            if (regData?.logo?.value) {
                                return {
                                    ...token,
                                    logoUrl: `data:image/png;base64,${regData.logo.value}`
                                };
                            }
                        }
                    } catch (e) {
                        console.log(`Failed to fetch logo for ${token.symbol} from registry:`, e);
                    }
                    return token;
                }));
                setCustomTokens(updatedTokens);
            } catch (e) {
                console.error('Failed to update background logos:', e);
            }
        }
        async function fetchAssets() {
            if (!isConnected || !address) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // 1. Fetch ADA balance and custom tokens from wallet
                if (lucid) {
                    const wallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet;
                    let utxos = [];
                    let lovelace = 0n;
                    if (wallet && typeof wallet.getUtxos === 'function') {
                        utxos = await wallet.getUtxos() || [];
                        lovelace = utxos.reduce((total, utxo)=>total + (utxo.assets?.lovelace ?? 0n), 0n);
                    } else if (wallet && typeof wallet.getLovelace === 'function') {
                        lovelace = BigInt(await wallet.getLovelace());
                        if (typeof lucid.utxosAt === 'function') {
                            utxos = await lucid.utxosAt(address) || [];
                        }
                    } else if (typeof lucid.utxosAt === 'function') {
                        utxos = await lucid.utxosAt(address) || [];
                        lovelace = utxos.reduce((total, utxo)=>total + (utxo.assets?.lovelace ?? 0n), 0n);
                    } else {
                        throw new Error('No supported wallet balance method found on Lucid instance');
                    }
                    setAdaBalance(Number(lovelace) / 1000000);
                    const aggregatedBalances = {};
                    for (const utxo of utxos){
                        if (!utxo.assets) continue;
                        for (const [unit, qty] of Object.entries(utxo.assets)){
                            if (unit === 'lovelace') continue;
                            aggregatedBalances[unit] = (aggregatedBalances[unit] || 0n) + BigInt(qty);
                        }
                    }
                    const parsedTokens = Object.entries(aggregatedBalances).map(([unit, qty])=>{
                        const policyId = unit.slice(0, 56);
                        const assetNameHex = unit.slice(56);
                        const symbol = hexToString(assetNameHex);
                        const tokenSymbolLower = symbol.toLowerCase();
                        const known = KNOWN_TOKENS[tokenSymbolLower];
                        const decimals = known ? known.decimals : 0;
                        const price = known ? known.price : 0;
                        const name = known ? known.name : `${symbol} Token`;
                        const balance = Number(qty) / Math.pow(10, decimals);
                        const usdValue = balance * price;
                        const logoUrl = known?.fallbackLogo;
                        return {
                            unit,
                            policyId,
                            name,
                            symbol,
                            balance,
                            usdValue,
                            price,
                            logoUrl
                        };
                    });
                    // Render tokens and balances immediately
                    setCustomTokens(parsedTokens);
                    // Fetch logos from the GitHub registry in the background
                    fetchRegistryLogos(parsedTokens);
                }
                // 2. Fetch owned music NFTs from the backend
                const authData = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
                const headers = {};
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                const res = await fetch('/api-backend/songs', {
                    headers
                });
                if (res.ok) {
                    const allTracks = await res.json();
                    const owned = allTracks.filter((t)=>t.is_owned);
                    setOwnedNfts(owned);
                }
                // 3. Try to fetch real-time ADA price from CoinGecko
                try {
                    const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
                    if (priceRes.ok) {
                        const priceData = await priceRes.json();
                        if (priceData?.cardano?.usd) {
                            setAdaPrice(priceData.cardano.usd);
                        }
                    }
                } catch (e) {
                    console.log('Failed to fetch real-time ADA price, using fallback.');
                }
            } catch (err) {
                console.error('AssetsView: Error fetching assets', err);
            } finally{
                setLoading(false);
            }
        }
        fetchAssets();
    }, [
        isConnected,
        address,
        lucid
    ]);
    // Calculate portfolio values
    const adaUsdValue = adaBalance * adaPrice;
    const tokensUsdValue = customTokens.reduce((acc, token)=>acc + token.usdValue, 0);
    const nftUsdValue = ownedNfts.reduce((acc, track)=>{
        const priceInADA = parseFloat(track.price || '5');
        return acc + priceInADA * adaPrice;
    }, 0);
    const totalUsdValue = adaUsdValue + tokensUsdValue + nftUsdValue;
    if (!isConnected) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "border border-midnight/[0.08] dark:border-white/[0.08] p-12 text-center bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 mx-auto mb-6 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#B794F4] rounded-none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconWallet$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconWallet$3e$__["IconWallet"], {
                        size: 32
                    }, void 0, false, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 238,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/AssetsView.tsx",
                    lineNumber: 237,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-display font-bold mb-2",
                    children: "Connect Wallet"
                }, void 0, false, {
                    fileName: "[project]/components/AssetsView.tsx",
                    lineNumber: 240,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-midnight/50 dark:text-white/50 text-sm max-w-sm mx-auto mb-6",
                    children: "Connect your Cardano wallet to view your asset balances, custom tokens, and collected NFTs."
                }, void 0, false, {
                    fileName: "[project]/components/AssetsView.tsx",
                    lineNumber: 241,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/AssetsView.tsx",
            lineNumber: 236,
            columnNumber: 4
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8 animate-fade-in",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border border-midnight/[0.08] dark:border-white/[0.08] p-6 lg:p-8 bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-none relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-pink via-purple-500 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 252,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-midnight/70 dark:text-white/40 text-xs uppercase tracking-widest font-display font-bold",
                                children: "Total Portfolio Worth"
                            }, void 0, false, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 254,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-4xl font-bold text-midnight dark:text-white mt-1 font-mono",
                                children: [
                                    "$",
                                    totalUsdValue.toFixed(2),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-sans font-normal text-midnight/70 dark:text-white/40",
                                        children: "USD"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 255,
                                        columnNumber: 114
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 255,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-midnight/60 dark:text-white/30 uppercase tracking-widest font-display font-bold mt-2",
                                children: "Real-Time Aggregated Balance (FT + NFT)"
                            }, void 0, false, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 256,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 253,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/[0.03] border border-midnight/10 dark:border-white/10 px-4 py-3 rounded-none flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-none bg-[#FF1F8A]/10 flex items-center justify-center text-[#FF1F8A]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconCoins$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconCoins$3e$__["IconCoins"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/components/AssetsView.tsx",
                                            lineNumber: 264,
                                            columnNumber: 8
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 263,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-midnight/70 dark:text-white/40 uppercase font-display font-bold leading-none mb-1",
                                                children: "Tokens Worth"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 267,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-mono text-sm font-bold text-midnight dark:text-white",
                                                children: [
                                                    "$",
                                                    (adaUsdValue + tokensUsdValue).toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 268,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 266,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 262,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/[0.03] border border-midnight/10 dark:border-white/10 px-4 py-3 rounded-none flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-none bg-[#B794F4]/10 flex items-center justify-center text-[#B794F4]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconMusic$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconMusic$3e$__["IconMusic"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/components/AssetsView.tsx",
                                            lineNumber: 274,
                                            columnNumber: 8
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 273,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-midnight/70 dark:text-white/40 uppercase font-display font-bold leading-none mb-1",
                                                children: "NFTs Worth"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 277,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-mono text-sm font-bold text-midnight dark:text-white",
                                                children: [
                                                    "$",
                                                    nftUsdValue.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 278,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 276,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 272,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 261,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AssetsView.tsx",
                lineNumber: 251,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex border-b border-midnight/[0.08] dark:border-white/[0.08] gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('tokens'),
                        className: `pb-4 text-sm font-display font-bold uppercase tracking-wider transition-all relative ${activeTab === 'tokens' ? 'text-midnight dark:text-white' : 'text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white'}`,
                        children: [
                            "Fungible Tokens",
                            activeTab === 'tokens' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-0 left-0 w-full h-[2px] bg-cyber-pink"
                            }, void 0, false, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 294,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 286,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('nfts'),
                        className: `pb-4 text-sm font-display font-bold uppercase tracking-wider transition-all relative ${activeTab === 'nfts' ? 'text-midnight dark:text-white' : 'text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white'}`,
                        children: [
                            "Non-Fungible Tokens (",
                            ownedNfts.length,
                            ")",
                            activeTab === 'nfts' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-0 left-0 w-full h-[2px] bg-cyber-pink"
                            }, void 0, false, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 305,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 297,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AssetsView.tsx",
                lineNumber: 285,
                columnNumber: 4
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-12 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 border-2 border-[#FF1F8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 312,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-midnight/70 dark:text-white/40 text-sm italic",
                        children: "Loading your portfolio assets..."
                    }, void 0, false, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 313,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AssetsView.tsx",
                lineNumber: 311,
                columnNumber: 5
            }, this) : activeTab === 'tokens' ? /* Fungible Tokens List */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border border-midnight/[0.08] dark:border-white/[0.08] rounded-none overflow-hidden bg-[#FAF9F6] dark:bg-[#0D0D12]/60",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "divide-y divide-white/[0.08]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-5 flex items-center justify-between hover:bg-midnight/5 dark:hover:bg-white/5 transition",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-none bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex items-center justify-center font-display font-bold text-midnight dark:text-white text-sm uppercase overflow-hidden",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
                                                alt: "ADA",
                                                className: "w-full h-full object-cover p-1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 323,
                                                columnNumber: 10
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/AssetsView.tsx",
                                            lineNumber: 322,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-display font-bold text-midnight dark:text-white",
                                                    children: "ADA"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AssetsView.tsx",
                                                    lineNumber: 326,
                                                    columnNumber: 10
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-midnight/70 dark:text-white/40 font-mono",
                                                    children: "Cardano Native Asset"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AssetsView.tsx",
                                                    lineNumber: 327,
                                                    columnNumber: 10
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AssetsView.tsx",
                                            lineNumber: 325,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AssetsView.tsx",
                                    lineNumber: 321,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-bold font-mono text-midnight dark:text-white",
                                            children: [
                                                adaBalance.toFixed(2),
                                                " ADA"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AssetsView.tsx",
                                            lineNumber: 331,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-midnight/70 dark:text-white/40 font-mono",
                                            children: [
                                                "$",
                                                adaUsdValue.toFixed(2),
                                                " USD"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AssetsView.tsx",
                                            lineNumber: 332,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AssetsView.tsx",
                                    lineNumber: 330,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AssetsView.tsx",
                            lineNumber: 320,
                            columnNumber: 7
                        }, this),
                        customTokens.length > 0 ? customTokens.map((token)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-5 flex items-center justify-between hover:bg-midnight/5 dark:hover:bg-white/5 transition",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-none bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex items-center justify-center font-display font-bold text-midnight dark:text-white text-sm uppercase overflow-hidden",
                                                children: token.symbol === 'DOBA' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$DobaVisualizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DobaVisualizer"], {
                                                    className: "text-[#FF1F8A] w-6 h-6 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AssetsView.tsx",
                                                    lineNumber: 343,
                                                    columnNumber: 13
                                                }, this) : token.logoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: token.logoUrl,
                                                    alt: token.symbol,
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AssetsView.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 13
                                                }, this) : token.symbol.slice(0, 2)
                                            }, void 0, false, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 341,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "font-display font-bold text-midnight dark:text-white",
                                                        children: token.symbol
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AssetsView.tsx",
                                                        lineNumber: 351,
                                                        columnNumber: 12
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-midnight/70 dark:text-white/40 font-mono truncate max-w-[200px]",
                                                        title: token.name,
                                                        children: token.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AssetsView.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 12
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 350,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 340,
                                        columnNumber: 10
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold font-mono text-midnight dark:text-white",
                                                children: [
                                                    token.balance.toLocaleString(undefined, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 6
                                                    }),
                                                    " ",
                                                    token.symbol
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 358,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-midnight/70 dark:text-white/40 font-mono",
                                                children: token.price > 0 ? `$${token.usdValue.toFixed(2)} USD` : '-'
                                            }, void 0, false, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 361,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 357,
                                        columnNumber: 10
                                    }, this)
                                ]
                            }, token.unit, true, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 339,
                                columnNumber: 9
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-8 text-center text-midnight/70 dark:text-white/40 text-sm",
                            children: "No custom fungible tokens found in this wallet."
                        }, void 0, false, {
                            fileName: "[project]/components/AssetsView.tsx",
                            lineNumber: 368,
                            columnNumber: 8
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AssetsView.tsx",
                    lineNumber: 318,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AssetsView.tsx",
                lineNumber: 317,
                columnNumber: 5
            }, this) : /* Non-Fungible Tokens (Music NFTs) Grid */ ownedNfts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6",
                children: ownedNfts.map((nft)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-midnight/[0.08] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-none overflow-hidden hover:border-midnight/20 dark:hover:border-white/20 transition group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "aspect-square w-full relative overflow-hidden bg-midnight/5 dark:bg-white/5 border-b border-white/5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: nft.image_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
                                        alt: nft.name,
                                        className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 381,
                                        columnNumber: 10
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-midnight/10 dark:border-white/10 px-2 py-0.5 rounded-none text-[10px] font-mono text-midnight/80 dark:text-white/80",
                                        children: [
                                            "ID #",
                                            nft.token_id
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 386,
                                        columnNumber: 10
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 380,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-display font-bold text-midnight dark:text-white truncate",
                                                children: nft.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 392,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-midnight/50 dark:text-white/50 truncate",
                                                children: [
                                                    "by ",
                                                    nft.artist
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 393,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 391,
                                        columnNumber: 10
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center pt-2 border-t border-white/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-midnight/60 dark:text-white/30 uppercase tracking-widest font-display font-bold",
                                                children: "EST. WORTH"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 396,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-sm font-bold text-cyber-pink",
                                                children: [
                                                    "$",
                                                    (parseFloat(nft.price || '5') * adaPrice).toFixed(2),
                                                    " USD"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AssetsView.tsx",
                                                lineNumber: 397,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AssetsView.tsx",
                                        lineNumber: 395,
                                        columnNumber: 10
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AssetsView.tsx",
                                lineNumber: 390,
                                columnNumber: 9
                            }, this)
                        ]
                    }, nft.token_id, true, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 379,
                        columnNumber: 8
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/AssetsView.tsx",
                lineNumber: 377,
                columnNumber: 6
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border border-midnight/[0.08] dark:border-white/[0.08] p-12 text-center bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPhoto$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPhoto$3e$__["IconPhoto"], {
                        className: "w-12 h-12 mx-auto mb-4 text-midnight/50 dark:text-white/20"
                    }, void 0, false, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 405,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-lg font-display font-bold mb-1",
                        children: "No NFTs Found"
                    }, void 0, false, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 406,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-midnight/70 dark:text-white/40 text-sm max-w-xs mx-auto",
                        children: "You don't own any music NFTs yet. Head over to the Marketplace to buy and collect tracks!"
                    }, void 0, false, {
                        fileName: "[project]/components/AssetsView.tsx",
                        lineNumber: 407,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AssetsView.tsx",
                lineNumber: 404,
                columnNumber: 6
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AssetsView.tsx",
        lineNumber: 249,
        columnNumber: 3
    }, this);
}
}),
"[project]/app/[locale]/(dashboard)/assets/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AssetsDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AssetsView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AssetsView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function AssetsDashboard() {
    const tNav = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])('nav');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setMounted(true), []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 animate-fade-in",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold mb-2",
                    children: tNav('assets')
                }, void 0, false, {
                    fileName: "[project]/app/[locale]/(dashboard)/assets/page.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/[locale]/(dashboard)/assets/page.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AssetsView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/[locale]/(dashboard)/assets/page.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[locale]/(dashboard)/assets/page.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconPhoto.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>IconPhoto
]);
/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$createReactComponent$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/createReactComponent.mjs [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            "d": "M15 8h.01",
            "key": "svg-0"
        }
    ],
    [
        "path",
        {
            "d": "M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12",
            "key": "svg-1"
        }
    ],
    [
        "path",
        {
            "d": "M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5",
            "key": "svg-2"
        }
    ],
    [
        "path",
        {
            "d": "M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3",
            "key": "svg-3"
        }
    ]
];
const IconPhoto = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$createReactComponent$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("outline", "photo", "Photo", __iconNode);
;
 //# sourceMappingURL=IconPhoto.mjs.map
}),
"[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconPhoto.mjs [app-ssr] (ecmascript) <export default as IconPhoto>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IconPhoto",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPhoto$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPhoto$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconPhoto.mjs [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_c7530270._.js.map