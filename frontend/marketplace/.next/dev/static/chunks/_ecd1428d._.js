(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/config.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BLOCKFROST_PROJECT_ID",
    ()=>BLOCKFROST_PROJECT_ID,
    "CARDANO_NETWORK",
    ()=>CARDANO_NETWORK,
    "EXPLORER_URL",
    ()=>EXPLORER_URL,
    "FEE_BPS",
    ()=>FEE_BPS,
    "MINTING_POLICY_ID",
    ()=>MINTING_POLICY_ID,
    "TREASURY_ADDRESS",
    ()=>TREASURY_ADDRESS,
    "queryClient",
    ()=>queryClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f40$tanstack$2b$query$2d$core$40$5$2e$101$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
;
const CARDANO_NETWORK = 'Mainnet';
const BLOCKFROST_PROJECT_ID = ("TURBOPACK compile-time value", "mainnetGh0oJFsbqjGDzAV5mdGUI8wv9zxQlkUk");
const MINTING_POLICY_ID = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_MINTING_POLICY_ID || '';
const EXPLORER_URL = 'https://cardanoscan.io';
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f40$tanstack$2b$query$2d$core$40$5$2e$101$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]();
const TREASURY_ADDRESS = ("TURBOPACK compile-time value", "addr1q9zxp864enlra5tmgl6y32havq946njdxa7qd4gcxetj0seycr094w3r7jt7sp46j7t6gz8k6aljk40k46cjm5epvjzsj0dkpq");
const FEE_BPS = 500n; // 5%
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardanoProvider",
    ()=>CardanoProvider,
    "Providers",
    ()=>Providers,
    "useCardano",
    ()=>useCardano
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f40$tanstack$2b$react$2d$query$40$5$2e$101$2e$2$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/@tanstack+react-query@5.101.2/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/sonner@1.7.4/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const CardanoContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    isConnected: false,
    isConnecting: false,
    address: null,
    stakeAddress: null,
    walletName: null,
    walletApi: null,
    lucid: null,
    sessionSeedPhrase: null,
    connect: async ()=>{},
    connectFromSeed: async ()=>{},
    disconnect: ()=>{}
});
function CardanoProvider({ children }) {
    _s();
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stakeAddress, setStakeAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [walletName, setWalletName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [walletApi, setWalletApi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lucid, setLucid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sessionSeedPhrase, setSessionSeedPhrase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CardanoProvider.useEffect": ()=>{
            const checkConnection = {
                "CardanoProvider.useEffect.checkConnection": async ()=>{
                    if ("TURBOPACK compile-time truthy", 1) {
                        const savedWallet = localStorage.getItem("doba_connected_wallet");
                        if (savedWallet && !isConnected && !isConnecting) {
                            connect(savedWallet).catch({
                                "CardanoProvider.useEffect.checkConnection": (err)=>{
                                    console.warn("Auto-reconnection failed:", err);
                                }
                            }["CardanoProvider.useEffect.checkConnection"]);
                        }
                    }
                }
            }["CardanoProvider.useEffect.checkConnection"];
            checkConnection();
        }
    }["CardanoProvider.useEffect"], []);
    const initializeLucid = async (wallet, seedPhrase)=>{
        setIsConnecting(true);
        try {
            // Dynamically import Lucid & Blockfrost to prevent SSR compilation errors
            const { Lucid, Blockfrost } = await __turbopack_context__.A("[project]/node_modules/.deno/@lucid-evolution+lucid@0.4.34/node_modules/@lucid-evolution/lucid/dist/index.js [app-client] (ecmascript, async loader)");
            // Initialize provider
            const blockfrostProvider = new Blockfrost(`https://cardano-mainnet.blockfrost.io/api/v0`, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOCKFROST_PROJECT_ID"]);
            // Initialize Lucid
            const lucidInstance = await Lucid(blockfrostProvider, "Mainnet");
            if (seedPhrase) {
                try {
                    lucidInstance.selectWallet.fromSeed(seedPhrase);
                    setWalletApi(null);
                } catch (e) {
                    console.error("Wallet selection from seed failed:", e);
                    throw new Error("Invalid seed phrase");
                }
            } else {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                const cardanoProvider = window.cardano;
                const walletProvider = cardanoProvider?.[wallet];
                if (!walletProvider || typeof walletProvider.enable !== "function") {
                    throw new Error(`Wallet extension \"${wallet}\" is not available. Please install or reconnect using an installed wallet.`);
                }
                const api = await walletProvider.enable();
                if (api) {
                    lucidInstance.selectWallet.fromAPI(api);
                    setWalletApi(api);
                }
            }
            const walletAddress = await lucidInstance.wallet().address();
            let walletStakeAddress = null;
            try {
                walletStakeAddress = await lucidInstance.wallet().rewardAddress();
            } catch  {
                walletStakeAddress = null;
            }
            setLucid(lucidInstance);
            setAddress(walletAddress);
            setStakeAddress(walletStakeAddress);
            setWalletName(wallet);
            setIsConnected(true);
            localStorage.setItem("doba_connected_wallet", wallet);
            if ("TURBOPACK compile-time truthy", 1) {
                sessionStorage.setItem("doba_just_connected", "true");
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Connected to ${wallet === "utxos" ? "Social Login" : wallet}`);
        } catch (error) {
            const errMessage = typeof error === 'string' ? error : error?.message || '';
            if (errMessage.includes('Refused') || errMessage.includes('cancelled') || errMessage.includes('rejected')) {
                console.log('Wallet connection cancelled by user.');
            } else {
                console.error("Wallet connection failed:", error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errMessage || "Failed to connect to wallet");
            }
            disconnect();
        } finally{
            setIsConnecting(false);
        }
    };
    const connect = async (wallet)=>{
        await initializeLucid(wallet);
    };
    const connectFromSeed = async (seedPhrase)=>{
        setSessionSeedPhrase(seedPhrase);
        if ("TURBOPACK compile-time truthy", 1) {
            sessionStorage.setItem("doba_session_seed", seedPhrase);
        }
        await initializeLucid("utxos", seedPhrase);
    };
    const disconnect = ()=>{
        setIsConnected(false);
        setAddress(null);
        setStakeAddress(null);
        setWalletName(null);
        setWalletApi(null);
        setLucid(null);
        setSessionSeedPhrase(null);
        localStorage.removeItem('doba_connected_wallet');
        localStorage.removeItem('doba_session_seed');
        localStorage.removeItem('doba_auth_data');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardanoContext.Provider, {
        value: {
            isConnected,
            address,
            stakeAddress,
            connect,
            connectFromSeed,
            disconnect,
            walletName,
            walletApi,
            lucid,
            isConnecting,
            sessionSeedPhrase
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/Providers.tsx",
        lineNumber: 161,
        columnNumber: 3
    }, this);
}
_s(CardanoProvider, "VcRb8+Q7FGUE6J6tStw32xPzm0o=");
_c = CardanoProvider;
const useCardano = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CardanoContext);
};
_s1(useCardano, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f40$tanstack$2b$react$2d$query$40$5$2e$101$2e$2$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryClient"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardanoProvider, {
            children: children
        }, void 0, false, {
            fileName: "[project]/components/Providers.tsx",
            lineNumber: 172,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Providers.tsx",
        lineNumber: 171,
        columnNumber: 3
    }, this);
}
_c1 = Providers;
var _c, _c1;
__turbopack_context__.k.register(_c, "CardanoProvider");
__turbopack_context__.k.register(_c1, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useAudioPlayer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAudioPlayer",
    ()=>useAudioPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const useAudioPlayer = ()=>{
    _s();
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [playerState, setPlayerState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        currentTrack: null,
        isPlaying: false,
        queue: [],
        currentIndex: 0,
        duration: 0,
        currentTime: 0
    });
    const play = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioPlayer.useCallback[play]": (track, tracks)=>{
            setPlayerState({
                "useAudioPlayer.useCallback[play]": (prev)=>{
                    const newQueue = tracks || [
                        track
                    ];
                    const index = newQueue.findIndex({
                        "useAudioPlayer.useCallback[play].index": (t)=>t.id === track.id
                    }["useAudioPlayer.useCallback[play].index"]);
                    return {
                        ...prev,
                        currentTrack: track,
                        queue: newQueue,
                        currentIndex: index >= 0 ? index : 0,
                        isPlaying: true
                    };
                }
            }["useAudioPlayer.useCallback[play]"]);
        }
    }["useAudioPlayer.useCallback[play]"], []);
    const pause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioPlayer.useCallback[pause]": ()=>{
            setPlayerState({
                "useAudioPlayer.useCallback[pause]": (prev)=>({
                        ...prev,
                        isPlaying: false
                    })
            }["useAudioPlayer.useCallback[pause]"]);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    }["useAudioPlayer.useCallback[pause]"], []);
    const resume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioPlayer.useCallback[resume]": ()=>{
            setPlayerState({
                "useAudioPlayer.useCallback[resume]": (prev)=>({
                        ...prev,
                        isPlaying: true
                    })
            }["useAudioPlayer.useCallback[resume]"]);
            if (audioRef.current) {
                audioRef.current.play().catch({
                    "useAudioPlayer.useCallback[resume]": (e)=>{
                        if (e.name !== 'AbortError') {
                            console.error('[AudioPlayer] Resume failed:', e);
                        }
                    }
                }["useAudioPlayer.useCallback[resume]"]);
            }
        }
    }["useAudioPlayer.useCallback[resume]"], []);
    const togglePlayPause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioPlayer.useCallback[togglePlayPause]": ()=>{
            if (playerState.isPlaying) {
                pause();
            } else {
                resume();
            }
        }
    }["useAudioPlayer.useCallback[togglePlayPause]"], [
        playerState.isPlaying,
        pause,
        resume
    ]);
    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioPlayer.useCallback[next]": ()=>{
            setPlayerState({
                "useAudioPlayer.useCallback[next]": (prev)=>{
                    const nextIndex = (prev.currentIndex + 1) % prev.queue.length;
                    const nextTrack = prev.queue[nextIndex];
                    return {
                        ...prev,
                        currentTrack: nextTrack,
                        currentIndex: nextIndex
                    };
                }
            }["useAudioPlayer.useCallback[next]"]);
        }
    }["useAudioPlayer.useCallback[next]"], []);
    const previous = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioPlayer.useCallback[previous]": ()=>{
            setPlayerState({
                "useAudioPlayer.useCallback[previous]": (prev)=>{
                    const prevIndex = prev.currentIndex === 0 ? prev.queue.length - 1 : prev.currentIndex - 1;
                    const prevTrack = prev.queue[prevIndex];
                    return {
                        ...prev,
                        currentTrack: prevTrack,
                        currentIndex: prevIndex
                    };
                }
            }["useAudioPlayer.useCallback[previous]"]);
        }
    }["useAudioPlayer.useCallback[previous]"], []);
    const seek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioPlayer.useCallback[seek]": (time)=>{
            if (audioRef.current) {
                audioRef.current.currentTime = time;
            }
            setPlayerState({
                "useAudioPlayer.useCallback[seek]": (prev)=>({
                        ...prev,
                        currentTime: time
                    })
            }["useAudioPlayer.useCallback[seek]"]);
        }
    }["useAudioPlayer.useCallback[seek]"], []);
    const setDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioPlayer.useCallback[setDuration]": (duration)=>{
            setPlayerState({
                "useAudioPlayer.useCallback[setDuration]": (prev)=>({
                        ...prev,
                        duration
                    })
            }["useAudioPlayer.useCallback[setDuration]"]);
        }
    }["useAudioPlayer.useCallback[setDuration]"], []);
    const setCurrentTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioPlayer.useCallback[setCurrentTime]": (time)=>{
            setPlayerState({
                "useAudioPlayer.useCallback[setCurrentTime]": (prev)=>({
                        ...prev,
                        currentTime: time
                    })
            }["useAudioPlayer.useCallback[setCurrentTime]"]);
        }
    }["useAudioPlayer.useCallback[setCurrentTime]"], []);
    return {
        audioRef,
        ...playerState,
        play,
        pause,
        resume,
        togglePlayPause,
        next,
        previous,
        seek,
        setDuration,
        setCurrentTime
    };
};
_s(useAudioPlayer, "DrZ0Y7YamcMjnZ6USwBoTGM2pMM=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useBackendAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBackendAuth",
    ()=>useBackendAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Providers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/sonner@1.7.4/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const API_URL = '/api-backend';
const REFRESH_BUFFER_MS = 60_000 // Refresh 1 minute before expiry
;
function useBackendAuth() {
    _s();
    const { address: cardanoAddress, stakeAddress, walletName, isConnected, walletApi } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCardano"])();
    const [accessToken, setAccessToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [preloadedNonce, setPreloadedNonce] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nonceTimestamp, setNonceTimestamp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const refreshTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const effectiveAddress = stakeAddress || cardanoAddress;
    // Preload nonce to bypass popup blockers for social auth (keeps user gesture intact)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBackendAuth.useEffect": ()=>{
            if (effectiveAddress && !isAuthenticated) {
                fetch(`${API_URL}/auth/challenge?address=${encodeURIComponent(effectiveAddress)}`).then({
                    "useBackendAuth.useEffect": (res)=>{
                        if (!res.ok) throw new Error('Failed to fetch challenge');
                        return res.json();
                    }
                }["useBackendAuth.useEffect"]).then({
                    "useBackendAuth.useEffect": (data)=>{
                        if (data && data.nonce) {
                            setPreloadedNonce(data.nonce);
                            setNonceTimestamp(Date.now());
                        }
                    }
                }["useBackendAuth.useEffect"]).catch({
                    "useBackendAuth.useEffect": ()=>{}
                }["useBackendAuth.useEffect"]);
            }
        }
    }["useBackendAuth.useEffect"], [
        effectiveAddress,
        isAuthenticated
    ]);
    // Schedule a silent refresh before the access token expires
    const scheduleRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBackendAuth.useCallback[scheduleRefresh]": (expiresAt)=>{
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
            const msUntilRefresh = expiresAt - Date.now() - REFRESH_BUFFER_MS;
            if (msUntilRefresh <= 0) {
                // Already expired or about to — refresh immediately
                refreshSession();
                return;
            }
            refreshTimerRef.current = setTimeout({
                "useBackendAuth.useCallback[scheduleRefresh]": ()=>{
                    refreshSession();
                }
            }["useBackendAuth.useCallback[scheduleRefresh]"], msUntilRefresh);
        }
    }["useBackendAuth.useCallback[scheduleRefresh]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBackendAuth.useCallback[logout]": ()=>{
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
            setAccessToken(null);
            setIsAuthenticated(false);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem('doba_auth_data');
            }
            // Tell the server to clear its HttpOnly cookie
            fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            }).catch({
                "useBackendAuth.useCallback[logout]": ()=>{}
            }["useBackendAuth.useCallback[logout]"]);
        }
    }["useBackendAuth.useCallback[logout]"], []);
    const refreshSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBackendAuth.useCallback[refreshSession]": async ()=>{
            try {
                const res = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (!res.ok) {
                    logout();
                    return null;
                }
                const data = await res.json();
                const expiresIn = data.expiresIn || 15 * 60 // Default 15 min
                ;
                const expiresAt = Date.now() + expiresIn * 1000;
                const newAuthData = {
                    accessToken: data.accessToken,
                    address: data.address || effectiveAddress || '',
                    expiresAt
                };
                localStorage.setItem('doba_auth_data', JSON.stringify(newAuthData));
                setAccessToken(data.accessToken);
                setIsAuthenticated(true);
                // Schedule the next refresh
                scheduleRefresh(expiresAt);
                return data.accessToken;
            } catch (err) {
                console.error('Failed to refresh session:', err);
                logout();
                return null;
            }
        }
    }["useBackendAuth.useCallback[refreshSession]"], [
        logout,
        effectiveAddress,
        scheduleRefresh
    ]);
    const [isCheckingAuth, setIsCheckingAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load stored auth on mount and schedule refresh
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBackendAuth.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = localStorage.getItem('doba_auth_data');
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    // If a wallet is connected, verify it matches the stored address
                    if (effectiveAddress) {
                        if (data.address === effectiveAddress) {
                            if (Date.now() < data.expiresAt - REFRESH_BUFFER_MS) {
                                setAccessToken(data.accessToken);
                                setIsAuthenticated(true);
                                scheduleRefresh(data.expiresAt);
                                setIsCheckingAuth(false);
                            } else {
                                refreshSession().finally({
                                    "useBackendAuth.useEffect": ()=>setIsCheckingAuth(false)
                                }["useBackendAuth.useEffect"]);
                            }
                        } else {
                            // Address mismatch, clear auth
                            localStorage.removeItem('doba_auth_data');
                            setIsCheckingAuth(false);
                        }
                    } else {
                        // No wallet connected yet, but we have stored credentials.
                        // Keep them in state and schedule refresh to keep session alive.
                        if (Date.now() < data.expiresAt - REFRESH_BUFFER_MS) {
                            setAccessToken(data.accessToken);
                            setIsAuthenticated(true);
                            scheduleRefresh(data.expiresAt);
                            setIsCheckingAuth(false);
                        } else {
                            refreshSession().finally({
                                "useBackendAuth.useEffect": ()=>setIsCheckingAuth(false)
                            }["useBackendAuth.useEffect"]);
                        }
                    }
                } catch (e) {
                    localStorage.removeItem('doba_auth_data');
                    setIsCheckingAuth(false);
                }
            } else {
                setIsCheckingAuth(false);
            }
        }
    }["useBackendAuth.useEffect"], [
        effectiveAddress,
        refreshSession,
        scheduleRefresh
    ]);
    // Cleanup timer on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBackendAuth.useEffect": ()=>{
            return ({
                "useBackendAuth.useEffect": ()=>{
                    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
                }
            })["useBackendAuth.useEffect"];
        }
    }["useBackendAuth.useEffect"], []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(async function loginFn(isRetry = false) {
        if (!isConnected || !walletApi || !effectiveAddress) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please connect your Cardano wallet first');
            return null;
        }
        setIsLoading(true);
        let nonce = preloadedNonce;
        const isExpired = nonceTimestamp && Date.now() - nonceTimestamp > 4 * 60 * 1000 // 4 minutes
        ;
        if (!nonce || isExpired) {
            try {
                const res = await fetch(`${API_URL}/auth/challenge?address=${encodeURIComponent(effectiveAddress)}`);
                if (!res.ok) {
                    const errData = await res.json().catch({
                        "useBackendAuth.useCallback[login].loginFn": ()=>({})
                    }["useBackendAuth.useCallback[login].loginFn"]);
                    throw new Error(errData.message || 'Failed to initialize secure session');
                }
                const data = await res.json();
                nonce = data.nonce;
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err?.message || 'Failed to initialize secure session. Please try again.');
                setIsLoading(false);
                return null;
            }
        }
        // Clear preloaded nonce so it's fresh for next time
        setPreloadedNonce(null);
        setNonceTimestamp(null);
        const timestamp = new Date().toISOString();
        const message = `Sign in to Doba Music\n\nBy signing this message, you agree to the Doba Terms of Service and Privacy Policy.\n\nAddress: ${effectiveAddress}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
        const hexMessage = Array.from(new TextEncoder().encode(message)).map({
            "useBackendAuth.useCallback[login].loginFn.hexMessage": (b)=>b.toString(16).padStart(2, '0')
        }["useBackendAuth.useCallback[login].loginFn.hexMessage"]).join('');
        try {
            const signatureResponse = await walletApi.signData(effectiveAddress, hexMessage);
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    address: effectiveAddress,
                    signature: signatureResponse.signature,
                    key: signatureResponse.key,
                    message: message,
                    nonce: nonce
                })
            });
            if (!res.ok) {
                const errData = await res.json();
                if (!isRetry && errData.message && errData.message.toLowerCase().includes('nonce')) {
                    // Secure session expired during the process, refresh and retry
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Secure session expired. Re-initiating authentication...');
                    setIsLoading(false);
                    return loginFn(true);
                }
                throw new Error(errData.message || 'Signature verification failed on backend');
            }
            const data = await res.json();
            const expiresIn = data.expiresIn || 15 * 60;
            const expiresAt = Date.now() + expiresIn * 1000;
            const authData = {
                accessToken: data.accessToken,
                address: data.address,
                expiresAt
            };
            localStorage.setItem('doba_auth_data', JSON.stringify(authData));
            setAccessToken(data.accessToken);
            setIsAuthenticated(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Successfully authenticated!');
            scheduleRefresh(expiresAt);
            return data.accessToken;
        } catch (error) {
            const errMessage = typeof error === 'string' ? error : error?.message || '';
            if (errMessage.includes('UserDeclined') || errMessage.includes('User declined') || errMessage.includes('cancelled') || errMessage.includes('Refused')) {
                console.log('User cancelled signature request.');
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Signature request cancelled');
            } else {
                console.error('Login error:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errMessage || 'Authentication failed');
            }
            return null;
        } finally{
            setIsLoading(false);
        }
    }, [
        isConnected,
        walletName,
        effectiveAddress,
        scheduleRefresh,
        preloadedNonce,
        nonceTimestamp,
        walletApi
    ]);
    const getValidToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBackendAuth.useCallback[getValidToken]": async ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = localStorage.getItem('doba_auth_data');
            if (!stored) return null;
            try {
                const data = JSON.parse(stored);
                if (data.address !== effectiveAddress) {
                    logout();
                    return null;
                }
                // If token is expired or close to expiry, refresh it
                if (Date.now() >= data.expiresAt - REFRESH_BUFFER_MS) {
                    return await refreshSession();
                }
                return data.accessToken;
            } catch (e) {
                logout();
                return null;
            }
        }
    }["useBackendAuth.useCallback[getValidToken]"], [
        effectiveAddress,
        refreshSession,
        logout
    ]);
    return {
        accessToken,
        login,
        getValidToken,
        logout,
        isLoading,
        isAuthenticated,
        isCheckingAuth,
        effectiveAddress
    };
}
_s(useBackendAuth, "l98JDjph9ZU/qUfJG2SmWx6v5dg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCardano"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AudioProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AudioProvider",
    ()=>AudioProvider,
    "useAudio",
    ()=>useAudio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAudioPlayer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAudioPlayer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Providers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useBackendAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useBackendAuth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const AudioContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const useAudio = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AudioContext);
    if (!context) throw new Error('useAudio must be used within an AudioProvider');
    return context;
};
_s(useAudio, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function AudioProvider({ children }) {
    _s1();
    const playerState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAudioPlayer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudioPlayer"])();
    const { isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCardano"])();
    const { accessToken, getValidToken, login: baseLogin, isAuthenticated: isAuth, isCheckingAuth, isLoading, logout, effectiveAddress } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useBackendAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBackendAuth"])();
    const [sidebarTrack, setSidebarTrack] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AudioProvider.useCallback[login]": ()=>{
            if (isAuth && accessToken) {
                return Promise.resolve(accessToken);
            }
            return baseLogin();
        }
    }["AudioProvider.useCallback[login]"], [
        isAuth,
        accessToken,
        baseLogin
    ]);
    const [recordedTracks, setRecordedTracks] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(new Set());
    // 1-minute stream rule implementation
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "AudioProvider.useEffect": ()=>{
            const track = playerState.currentTrack;
            if (!track || !playerState.isPlaying) return;
            const trackId = Number(track.id ?? track.token_id);
            if (isNaN(trackId)) return;
            if (recordedTracks.has(trackId)) return;
            // Check for 1 minute reached
            if (playerState.currentTime >= 60) {
                const recordPlay = {
                    "AudioProvider.useEffect.recordPlay": async ()=>{
                        try {
                            // SILENT analytics: Only record if we already have a valid token
                            if (!accessToken) return;
                            const res = await fetch(`/api-backend/songs/${trackId}/play`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`
                                }
                            });
                            if (res.ok) {
                                setRecordedTracks({
                                    "AudioProvider.useEffect.recordPlay": (prev)=>new Set(prev).add(trackId)
                                }["AudioProvider.useEffect.recordPlay"]);
                            } else {
                                const errText = await res.text();
                                console.error(`[Analytics] Failed:`, res.status, errText);
                            }
                        } catch (err) {
                            console.error('[Analytics] Network error:', err);
                        }
                    }
                }["AudioProvider.useEffect.recordPlay"];
                recordPlay();
            }
        }
    }["AudioProvider.useEffect"], [
        playerState.currentTime,
        playerState.isPlaying,
        playerState.currentTrack,
        recordedTracks,
        getValidToken
    ]);
    // Reset recorded tracks when the authenticated user changes or periodically? 
    // For now, let's just keep track of what's been recorded in this session.
    // We might want to allow re-recording same track?
    // The requirement is "1 stream equals every stream greater than 1 minute".
    // If they play for 1 min, stop, and play again, should it count as another stream? 
    // Usually yes. So let's clear the recorded flag if the track ID changes.
    const [lastTrackId, setLastTrackId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "AudioProvider.useEffect": ()=>{
            const track = playerState.currentTrack;
            const currentId = track?.id ?? track?.token_id;
            if (currentId !== lastTrackId) {
                setLastTrackId(currentId);
            }
        }
    }["AudioProvider.useEffect"], [
        playerState.currentTrack,
        lastTrackId
    ]);
    // Sync sidebar track with current player track if sidebar is open
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "AudioProvider.useEffect": ()=>{
            if (playerState.currentTrack && isSidebarOpen) {
                // Always sync if sidebar is open and doesn't match current track
                const sidebarId = sidebarTrack?.id ?? sidebarTrack?.token_id;
                const currentTrack = playerState.currentTrack;
                const currentId = currentTrack?.id ?? currentTrack?.token_id;
                if (!sidebarTrack || sidebarId !== currentId) {
                    setSidebarTrack(playerState.currentTrack);
                }
            }
        }
    }["AudioProvider.useEffect"], [
        playerState.currentTrack?.id,
        isSidebarOpen
    ]);
    // Auto-sign-in logic removed to prevent "Popup blocked" errors. 
    // Users must explicitly click to authenticate, ensuring a valid user gesture.
    const handleOpenSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AudioProvider.useCallback[handleOpenSidebar]": (track)=>{
            const trackId = track?.id ?? track?.token_id;
            setIsSidebarOpen({
                "AudioProvider.useCallback[handleOpenSidebar]": (prev)=>{
                    if (prev) {
                        const currentSidebarId = sidebarTrack?.id ?? sidebarTrack?.token_id;
                        if (currentSidebarId === trackId) {
                            return false;
                        }
                    }
                    setSidebarTrack(track);
                    return true;
                }
            }["AudioProvider.useCallback[handleOpenSidebar]"]);
        }
    }["AudioProvider.useCallback[handleOpenSidebar]"], [
        sidebarTrack
    ]);
    const toggleSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AudioProvider.useCallback[toggleSidebar]": ()=>{
            setIsSidebarOpen({
                "AudioProvider.useCallback[toggleSidebar]": (prev)=>!prev
            }["AudioProvider.useCallback[toggleSidebar]"]);
        }
    }["AudioProvider.useCallback[toggleSidebar]"], []);
    const handlePlayTrack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AudioProvider.useCallback[handlePlayTrack]": (track, tracks)=>{
            if (!isConnected) {
                login(); // Only trigger login if NOT EVEN CONNECTED
                return;
            }
            if (playerState.currentTrack?.id === track.id) {
                playerState.togglePlayPause();
                return;
            }
            // Clear recorded flag if playing a different track
            const trackId = track.id;
            if (trackId !== lastTrackId) {
                setRecordedTracks({
                    "AudioProvider.useCallback[handlePlayTrack]": (prev)=>{
                        const next = new Set(prev);
                        next.delete(trackId);
                        return next;
                    }
                }["AudioProvider.useCallback[handlePlayTrack]"]);
            }
            playerState.play(track, tracks);
            // If sidebar is open, update it to the track being played
            if (isSidebarOpen) {
                setSidebarTrack(track);
            }
        }
    }["AudioProvider.useCallback[handlePlayTrack]"], [
        playerState,
        isAuth,
        login,
        isSidebarOpen,
        lastTrackId
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AudioProvider.useMemo[value]": ()=>({
                playerState,
                handlePlayTrack,
                effectiveAddress,
                isConnected,
                isAuthenticated: isAuth,
                isCheckingAuth,
                isLoading,
                accessToken,
                getValidToken,
                sidebarTrack,
                isSidebarOpen,
                handleOpenSidebar,
                toggleSidebar,
                login,
                logout
            })
    }["AudioProvider.useMemo[value]"], [
        playerState,
        handlePlayTrack,
        effectiveAddress,
        isConnected,
        isAuth,
        isCheckingAuth,
        isLoading,
        accessToken,
        getValidToken,
        sidebarTrack,
        isSidebarOpen,
        handleOpenSidebar,
        toggleSidebar,
        login,
        logout
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AudioContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/AudioProvider.tsx",
        lineNumber: 182,
        columnNumber: 3
    }, this);
}
_s1(AudioProvider, "uADQ+81E31mgvM1E+aIytN1Uizg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAudioPlayer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudioPlayer"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCardano"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useBackendAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBackendAuth"]
    ];
});
_c = AudioProvider;
var _c;
__turbopack_context__.k.register(_c, "AudioProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ThemeProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$2d$themes$40$0$2e$4$2e$6$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next-themes@0.4.6/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
'use client';
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$2d$themes$40$0$2e$4$2e$6$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ThemeProvider.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/DynamicFavicon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DynamicFavicon",
    ()=>DynamicFavicon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$2d$themes$40$0$2e$4$2e$6$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next-themes@0.4.6/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function DynamicFavicon() {
    _s();
    const { theme, resolvedTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$2d$themes$40$0$2e$4$2e$6$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DynamicFavicon.useEffect": ()=>{
            setMounted(true);
        }
    }["DynamicFavicon.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DynamicFavicon.useEffect": ()=>{
            if (!mounted) return;
            const currentTheme = theme === 'system' ? resolvedTheme : theme;
            const iconUrl = currentTheme === 'dark' ? '/doba.ico' : '/doba-light.ico';
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = iconUrl;
        }
    }["DynamicFavicon.useEffect"], [
        theme,
        resolvedTheme,
        mounted
    ]);
    return null;
}
_s(DynamicFavicon, "U5eG7yTlhpvNdzyzUvlUax2OaYI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$2d$themes$40$0$2e$4$2e$6$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = DynamicFavicon;
var _c;
__turbopack_context__.k.register(_c, "DynamicFavicon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/sonner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next@16.1.6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$2d$themes$40$0$2e$4$2e$6$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/next-themes@0.4.6/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.deno/sonner@1.7.4/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const Toaster = ({ ...props })=>{
    _s();
    const { theme = 'system' } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$2d$themes$40$0$2e$4$2e$6$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Toaster.useEffect": ()=>{
            const handleGlobalClick = {
                "Toaster.useEffect.handleGlobalClick": (e)=>{
                    // If click target is NOT inside a sonner toast, dismiss all active toasts
                    if (!e.target.closest('[data-sonner-toast]')) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].dismiss();
                    }
                }
            }["Toaster.useEffect.handleGlobalClick"];
            // Use capture phase to ensure it catches clicks before other things stop propagation
            document.addEventListener('click', handleGlobalClick, true);
            return ({
                "Toaster.useEffect": ()=>document.removeEventListener('click', handleGlobalClick, true)
            })["Toaster.useEffect"];
        }
    }["Toaster.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$40$16$2e$1$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$sonner$40$1$2e$7$2e$4$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
        theme: theme,
        className: "toaster group",
        toastOptions: {
            classNames: {
                toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-none',
                description: 'group-[.toast]:text-muted-foreground',
                actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-none',
                cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-none',
                closeButton: 'group-[.toast]:rounded-none !rounded-none group-[.toast]:bg-background group-[.toast]:border-border'
            }
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sonner.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Toaster, "WvhOx+yM6EFThUbcz/Ht6xXcN4Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$deno$2f$next$2d$themes$40$0$2e$4$2e$6$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Toaster;
;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_ecd1428d._.js.map