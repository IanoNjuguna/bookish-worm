module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/config.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
;
const CARDANO_NETWORK = 'Mainnet';
const BLOCKFROST_PROJECT_ID = ("TURBOPACK compile-time value", "mainnetGh0oJFsbqjGDzAV5mdGUI8wv9zxQlkUk") || 'mainnetGh0oJFsbqjGDzAV5mdGUI8wv9zxQlkUk';
const MINTING_POLICY_ID = process.env.NEXT_PUBLIC_MINTING_POLICY_ID || '';
const EXPLORER_URL = 'https://cardanoscan.io';
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]();
const TREASURY_ADDRESS = ("TURBOPACK compile-time value", "addr1q9zxp864enlra5tmgl6y32havq946njdxa7qd4gcxetj0seycr094w3r7jt7sp46j7t6gz8k6aljk40k46cjm5epvjzsj0dkpq") || 'addr1q9zxp864enlra5tmgl6y32havq946njdxa7qd4gcxetj0seycr094w3r7jt7sp46j7t6gz8k6aljk40k46cjm5epvjzsj0dkpq';
const FEE_BPS = 500n; // 5%
}),
"[project]/components/Providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardanoProvider",
    ()=>CardanoProvider,
    "Providers",
    ()=>Providers,
    "useCardano",
    ()=>useCardano
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const CardanoContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
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
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stakeAddress, setStakeAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [walletName, setWalletName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [walletApi, setWalletApi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lucid, setLucid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sessionSeedPhrase, setSessionSeedPhrase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const checkConnection = async ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        };
        checkConnection();
    }, []);
    const initializeLucid = async (wallet, seedPhrase)=>{
        setIsConnecting(true);
        try {
            // Dynamically import Lucid & Blockfrost to prevent SSR compilation errors
            const { Lucid, Blockfrost } = await __turbopack_context__.A("[project]/node_modules/@lucid-evolution/lucid/dist/index.js [app-ssr] (ecmascript, async loader)");
            // Initialize provider
            const blockfrostProvider = new Blockfrost(`https://cardano-mainnet.blockfrost.io/api/v0`, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BLOCKFROST_PROJECT_ID"]);
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
                if ("TURBOPACK compile-time truthy", 1) {
                    throw new Error("Wallet connection is only available in the browser");
                }
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
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Connected to ${wallet === "utxos" ? "Social Login" : wallet}`);
        } catch (error) {
            const errMessage = typeof error === 'string' ? error : error?.message || '';
            if (errMessage.includes('Refused') || errMessage.includes('cancelled') || errMessage.includes('rejected')) {
                console.log('Wallet connection cancelled by user.');
            } else {
                console.error("Wallet connection failed:", error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(errMessage || "Failed to connect to wallet");
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardanoContext.Provider, {
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
        lineNumber: 173,
        columnNumber: 3
    }, this);
}
const useCardano = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CardanoContext);
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["queryClient"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardanoProvider, {
            children: children
        }, void 0, false, {
            fileName: "[project]/components/Providers.tsx",
            lineNumber: 184,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Providers.tsx",
        lineNumber: 183,
        columnNumber: 3
    }, this);
}
}),
"[project]/hooks/useAudioPlayer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAudioPlayer",
    ()=>useAudioPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const useAudioPlayer = ()=>{
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [playerState, setPlayerState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        currentTrack: null,
        isPlaying: false,
        queue: [],
        currentIndex: 0,
        duration: 0,
        currentTime: 0
    });
    const play = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((track, tracks)=>{
        setPlayerState((prev)=>{
            const newQueue = tracks || [
                track
            ];
            const index = newQueue.findIndex((t)=>t.id === track.id);
            return {
                ...prev,
                currentTrack: track,
                queue: newQueue,
                currentIndex: index >= 0 ? index : 0,
                isPlaying: true
            };
        });
    }, []);
    const pause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setPlayerState((prev)=>({
                ...prev,
                isPlaying: false
            }));
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);
    const resume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setPlayerState((prev)=>({
                ...prev,
                isPlaying: true
            }));
        if (audioRef.current) {
            audioRef.current.play().catch((e)=>{
                if (e.name !== 'AbortError') {
                    console.error('[AudioPlayer] Resume failed:', e);
                }
            });
        }
    }, []);
    const togglePlayPause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (playerState.isPlaying) {
            pause();
        } else {
            resume();
        }
    }, [
        playerState.isPlaying,
        pause,
        resume
    ]);
    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setPlayerState((prev)=>{
            const nextIndex = (prev.currentIndex + 1) % prev.queue.length;
            const nextTrack = prev.queue[nextIndex];
            return {
                ...prev,
                currentTrack: nextTrack,
                currentIndex: nextIndex
            };
        });
    }, []);
    const previous = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setPlayerState((prev)=>{
            const prevIndex = prev.currentIndex === 0 ? prev.queue.length - 1 : prev.currentIndex - 1;
            const prevTrack = prev.queue[prevIndex];
            return {
                ...prev,
                currentTrack: prevTrack,
                currentIndex: prevIndex
            };
        });
    }, []);
    const seek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((time)=>{
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
        setPlayerState((prev)=>({
                ...prev,
                currentTime: time
            }));
    }, []);
    const setDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((duration)=>{
        setPlayerState((prev)=>({
                ...prev,
                duration
            }));
    }, []);
    const setCurrentTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((time)=>{
        setPlayerState((prev)=>({
                ...prev,
                currentTime: time
            }));
    }, []);
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
}),
"[project]/hooks/useBackendAuth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBackendAuth",
    ()=>useBackendAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Providers.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
const API_URL = '/api-backend';
const REFRESH_BUFFER_MS = 60_000 // Refresh 1 minute before expiry
;
function useBackendAuth() {
    const { address: cardanoAddress, stakeAddress, walletName, isConnected, walletApi, lucid } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCardano"])();
    const [accessToken, setAccessToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const refreshTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const effectiveAddress = cardanoAddress || stakeAddress;
    // Schedule a silent refresh before the access token expires
    const scheduleRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((data)=>{
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        const timeUntilRefresh = data.expiresAt - Date.now() - REFRESH_BUFFER_MS;
        if (timeUntilRefresh <= 0) {
            refreshSession();
            return;
        }
        refreshTimerRef.current = setTimeout(()=>{
            refreshSession();
        }, timeUntilRefresh);
    }, []);
    // Silent session refresh using HTTP-only refresh token cookie
    const refreshSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!res.ok) {
                localStorage.removeItem('doba_auth_data');
                setAccessToken(null);
                setIsAuthenticated(false);
                return null;
            }
            const data = await res.json();
            if (data.accessToken) {
                const expiresAt = data.expiresAt ? new Date(data.expiresAt).getTime() : Date.now() + (data.expiresIn ? data.expiresIn * 1000 : 3600_000);
                const authData = {
                    accessToken: data.accessToken,
                    address: data.address || effectiveAddress || '',
                    expiresAt
                };
                localStorage.setItem('doba_auth_data', JSON.stringify(authData));
                setAccessToken(data.accessToken);
                setIsAuthenticated(true);
                scheduleRefresh(authData);
                return data.accessToken;
            }
            return null;
        } catch (err) {
            localStorage.removeItem('doba_auth_data');
            setAccessToken(null);
            setIsAuthenticated(false);
            return null;
        }
    }, [
        effectiveAddress,
        scheduleRefresh
    ]);
    // Silent auth restoration from localStorage on mount & when wallet connects
    const [isCheckingAuth, setIsCheckingAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const stored = localStorage.getItem('doba_auth_data');
        if (stored) {
            try {
                const authData = JSON.parse(stored);
                if (effectiveAddress && authData.address && authData.address.toLowerCase() !== effectiveAddress.toLowerCase()) {
                    localStorage.removeItem('doba_auth_data');
                    setAccessToken(null);
                    setIsAuthenticated(false);
                    setIsCheckingAuth(false);
                    return;
                }
                if (authData.expiresAt > Date.now() + REFRESH_BUFFER_MS) {
                    setAccessToken(authData.accessToken);
                    setIsAuthenticated(true);
                    setIsCheckingAuth(false);
                    scheduleRefresh(authData);
                } else if (authData.expiresAt > Date.now()) {
                    refreshSession().finally(()=>setIsCheckingAuth(false));
                } else {
                    refreshSession().finally(()=>setIsCheckingAuth(false));
                }
            } catch (e) {
                localStorage.removeItem('doba_auth_data');
                setIsCheckingAuth(false);
            }
        } else {
            setIsCheckingAuth(false);
        }
    }, [
        effectiveAddress,
        refreshSession,
        scheduleRefresh
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        };
    }, []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async function loginFn(isRetry = false) {
        if (!isConnected || !effectiveAddress) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Please connect your Cardano wallet first');
            return null;
        }
        setIsLoading(true);
        let nonce;
        try {
            const res = await fetch(`${API_URL}/auth/challenge?address=${encodeURIComponent(effectiveAddress)}`);
            if (!res.ok) {
                if (res.status === 429) {
                    throw new Error('Too many requests. Please wait a few seconds before trying again.');
                }
                const errData = await res.json().catch(()=>({}));
                const errorMsg = errData.message || errData.error || errData.detail || `Server returned ${res.status}`;
                throw new Error(errorMsg);
            }
            const data = await res.json();
            nonce = data.nonce;
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(err?.message || 'Failed to initialize secure session. Please try again.');
            setIsLoading(false);
            return null;
        }
        const timestamp = new Date().toISOString();
        const message = `Sign in to Doba Music\n\nBy signing this message, you agree to the Doba Terms of Service and Privacy Policy.\n\nAddress: ${effectiveAddress}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
        const hexMessage = Array.from(new TextEncoder().encode(message)).map((b)=>b.toString(16).padStart(2, '0')).join('');
        try {
            let signatureResponse;
            if (walletApi && typeof walletApi.signData === 'function') {
                signatureResponse = await walletApi.signData(effectiveAddress, hexMessage);
            } else if (lucid) {
                const sig = await lucid.wallet().signMessage(hexMessage);
                signatureResponse = {
                    signature: sig.signature,
                    key: sig.key
                };
            } else {
                throw new Error('No active wallet API or Lucid instance available for signing.');
            }
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
                if (res.status === 429) {
                    throw new Error('Too many login attempts. Please wait a few seconds before trying again.');
                }
                const errData = await res.json().catch(()=>({}));
                if (!isRetry && errData.message && errData.message.toLowerCase().includes('nonce')) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Secure session expired. Re-initiating authentication...');
                    setIsLoading(false);
                    return loginFn(true);
                }
                const errorMsg = errData.message || errData.error || errData.detail || `Login failed (${res.status})`;
                throw new Error(errorMsg);
            }
            const data = await res.json();
            const expiresAt = data.expiresAt ? new Date(data.expiresAt).getTime() : Date.now() + (data.expiresIn ? data.expiresIn * 1000 : 3600_000);
            const authData = {
                accessToken: data.accessToken,
                address: data.address || effectiveAddress,
                expiresAt
            };
            localStorage.setItem('doba_auth_data', JSON.stringify(authData));
            setAccessToken(data.accessToken);
            setIsAuthenticated(true);
            setIsLoading(false);
            scheduleRefresh(authData);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Successfully authenticated!');
            return data.accessToken;
        } catch (err) {
            console.error('Login error:', err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(err?.message || 'Authentication failed. Please try again.');
            setIsLoading(false);
            return null;
        }
    }, [
        isConnected,
        walletApi,
        lucid,
        effectiveAddress,
        scheduleRefresh
    ]);
    const logoutFn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {}
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        localStorage.removeItem('doba_auth_data');
        setAccessToken(null);
        setIsAuthenticated(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Signed out');
    }, []);
    const getValidToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const stored = localStorage.getItem('doba_auth_data');
        if (stored) {
            try {
                const authData = JSON.parse(stored);
                if (authData.expiresAt > Date.now() + REFRESH_BUFFER_MS) {
                    return authData.accessToken;
                }
            } catch (e) {}
        }
        return refreshSession();
    }, [
        refreshSession
    ]);
    return {
        accessToken,
        isLoading,
        isAuthenticated,
        isCheckingAuth,
        login,
        logout: logoutFn,
        getValidToken,
        effectiveAddress
    };
}
}),
"[project]/components/AudioProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AudioProvider",
    ()=>AudioProvider,
    "useAudio",
    ()=>useAudio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAudioPlayer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAudioPlayer.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Providers.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useBackendAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useBackendAuth.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const AudioContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const useAudio = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AudioContext);
    if (!context) throw new Error('useAudio must be used within an AudioProvider');
    return context;
};
function AudioProvider({ children }) {
    const playerState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAudioPlayer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAudioPlayer"])();
    const { isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCardano"])();
    const { accessToken, getValidToken, login: baseLogin, isAuthenticated: isAuth, isCheckingAuth, isLoading, logout, effectiveAddress } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useBackendAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBackendAuth"])();
    const [sidebarTrack, setSidebarTrack] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(false);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (isAuth && accessToken) {
            return Promise.resolve(accessToken);
        }
        return baseLogin();
    }, [
        isAuth,
        accessToken,
        baseLogin
    ]);
    const [recordedTracks, setRecordedTracks] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(new Set());
    // 1-minute stream rule implementation
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        const track = playerState.currentTrack;
        if (!track || !playerState.isPlaying) return;
        const trackId = Number(track.id ?? track.token_id);
        if (isNaN(trackId)) return;
        if (recordedTracks.has(trackId)) return;
        // Check for 1 minute reached
        if (playerState.currentTime >= 60) {
            const recordPlay = async ()=>{
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
                        setRecordedTracks((prev)=>new Set(prev).add(trackId));
                    } else {
                        const errText = await res.text();
                        console.error(`[Analytics] Failed:`, res.status, errText);
                    }
                } catch (err) {
                    console.error('[Analytics] Network error:', err);
                }
            };
            recordPlay();
        }
    }, [
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
    const [lastTrackId, setLastTrackId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        const track = playerState.currentTrack;
        const currentId = track?.id ?? track?.token_id;
        if (currentId !== lastTrackId) {
            setLastTrackId(currentId);
        }
    }, [
        playerState.currentTrack,
        lastTrackId
    ]);
    // Sync sidebar track with current player track if sidebar is open
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if (playerState.currentTrack && isSidebarOpen) {
            // Always sync if sidebar is open and doesn't match current track
            const sidebarId = sidebarTrack?.id ?? sidebarTrack?.token_id;
            const currentTrack = playerState.currentTrack;
            const currentId = currentTrack?.id ?? currentTrack?.token_id;
            if (!sidebarTrack || sidebarId !== currentId) {
                setSidebarTrack(playerState.currentTrack);
            }
        }
    }, [
        playerState.currentTrack?.id,
        isSidebarOpen
    ]);
    // Auto-sign-in logic removed to prevent "Popup blocked" errors. 
    // Users must explicitly click to authenticate, ensuring a valid user gesture.
    const handleOpenSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((track)=>{
        const trackId = track?.id ?? track?.token_id;
        setIsSidebarOpen((prev)=>{
            if (prev) {
                const currentSidebarId = sidebarTrack?.id ?? sidebarTrack?.token_id;
                if (currentSidebarId === trackId) {
                    return false;
                }
            }
            setSidebarTrack(track);
            return true;
        });
    }, [
        sidebarTrack
    ]);
    const toggleSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsSidebarOpen((prev)=>!prev);
    }, []);
    const handlePlayTrack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((track, tracks)=>{
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
            setRecordedTracks((prev)=>{
                const next = new Set(prev);
                next.delete(trackId);
                return next;
            });
        }
        playerState.play(track, tracks);
        // If sidebar is open, update it to the track being played
        if (isSidebarOpen) {
            setSidebarTrack(track);
        }
    }, [
        playerState,
        isAuth,
        login,
        isSidebarOpen,
        lastTrackId
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            playerState,
            handlePlayTrack,
            effectiveAddress: effectiveAddress || undefined,
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
        }), [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AudioContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/AudioProvider.tsx",
        lineNumber: 182,
        columnNumber: 3
    }, this);
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/components/ThemeProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ThemeProvider.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/DynamicFavicon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DynamicFavicon",
    ()=>DynamicFavicon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function DynamicFavicon() {
    const { theme, resolvedTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        theme,
        resolvedTheme,
        mounted
    ]);
    return null;
}
}),
"[project]/components/ui/sonner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const Toaster = ({ ...props })=>{
    const { theme = 'system' } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleGlobalClick = (e)=>{
            // If click target is NOT inside a sonner toast, dismiss all active toasts
            if (!e.target.closest('[data-sonner-toast]')) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss();
            }
        };
        // Use capture phase to ensure it catches clicks before other things stop propagation
        document.addEventListener('click', handleGlobalClick, true);
        return ()=>document.removeEventListener('click', handleGlobalClick, true);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
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
;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__776851c6._.js.map