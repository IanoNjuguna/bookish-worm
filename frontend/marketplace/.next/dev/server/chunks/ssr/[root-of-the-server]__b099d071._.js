module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
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
"[project]/components/Providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/components/Providers.tsx'\n\nExpected ',', got '}'");
e.code = 'MODULE_UNPARSABLE';
throw e;
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
    const [preloadedNonce, setPreloadedNonce] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nonceTimestamp, setNonceTimestamp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const refreshTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const effectiveAddress = stakeAddress || cardanoAddress;
    // Preload nonce to bypass popup blockers for social auth (keeps user gesture intact)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (effectiveAddress && !isAuthenticated) {
            fetch(`${API_URL}/auth/challenge?address=${encodeURIComponent(effectiveAddress)}`).then((res)=>{
                if (!res.ok) throw new Error('Failed to fetch challenge');
                return res.json();
            }).then((data)=>{
                if (data && data.nonce) {
                    setPreloadedNonce(data.nonce);
                    setNonceTimestamp(Date.now());
                }
            }).catch(()=>{});
        }
    }, [
        effectiveAddress,
        isAuthenticated
    ]);
    // Schedule a silent refresh before the access token expires
    const scheduleRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((expiresAt)=>{
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        const msUntilRefresh = expiresAt - Date.now() - REFRESH_BUFFER_MS;
        if (msUntilRefresh <= 0) {
            // Already expired or about to — refresh immediately
            refreshSession();
            return;
        }
        refreshTimerRef.current = setTimeout(()=>{
            refreshSession();
        }, msUntilRefresh);
    }, []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        setAccessToken(null);
        setIsAuthenticated(false);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Tell the server to clear its HttpOnly cookie
        fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        }).catch(()=>{});
    }, []);
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
    }, [
        logout,
        effectiveAddress,
        scheduleRefresh
    ]);
    const [isCheckingAuth, setIsCheckingAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load stored auth on mount and schedule refresh
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const stored = undefined;
    }, [
        effectiveAddress,
        refreshSession,
        scheduleRefresh
    ]);
    // Cleanup timer on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        };
    }, []);
    const resolveSignerApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (walletApi && typeof walletApi.signData === 'function') {
            return walletApi;
        }
        // Seed/test-mode wallet fallback (no CIP-30 extension available)
        if (walletName === 'utxos' && lucid) {
            const selectedWallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet;
            if (selectedWallet && typeof selectedWallet.signMessage === 'function') {
                return {
                    signData: async (address, payload)=>selectedWallet.signMessage(address, payload)
                };
            }
        }
        // Extension reconnect fallback in case context signer wasn't hydrated yet
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return null;
    }, [
        walletApi,
        walletName,
        lucid
    ]);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async function loginFn(isRetry = false) {
        if (!isConnected || !effectiveAddress) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Please connect your Cardano wallet first');
            return null;
        }
        const signerApi = await resolveSignerApi();
        if (!signerApi) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Wallet signer not ready. Please reconnect and try again.');
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
                    const errData = await res.json().catch(()=>({}));
                    throw new Error(errData.message || 'Failed to initialize secure session');
                }
                const data = await res.json();
                nonce = data.nonce;
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(err?.message || 'Failed to initialize secure session. Please try again.');
                setIsLoading(false);
                return null;
            }
        }
        // Clear preloaded nonce so it's fresh for next time
        setPreloadedNonce(null);
        setNonceTimestamp(null);
        const timestamp = new Date().toISOString();
        const message = `Sign in to Doba Music\n\nBy signing this message, you agree to the Doba Terms of Service and Privacy Policy.\n\nAddress: ${effectiveAddress}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
        const hexMessage = Array.from(new TextEncoder().encode(message)).map((b)=>b.toString(16).padStart(2, '0')).join('');
        try {
            const signatureResponse = await signerApi.signData(effectiveAddress, hexMessage);
            if (!signatureResponse?.signature || !signatureResponse?.key) {
                throw new Error('Wallet returned an invalid signature payload');
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
                const errData = await res.json();
                if (!isRetry && errData.message && errData.message.toLowerCase().includes('nonce')) {
                    // Secure session expired during the process, refresh and retry
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Secure session expired. Re-initiating authentication...');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Successfully authenticated!');
            scheduleRefresh(expiresAt);
            return data.accessToken;
        } catch (error) {
            const errMessage = typeof error === 'string' ? error : error?.message || '';
            const normalized = errMessage.toLowerCase();
            const isUserCancelled = normalized.includes('userdeclined') || normalized.includes('user declined') || normalized.includes('declined sign data') || normalized.includes('cancelled') || normalized.includes('canceled') || normalized.includes('refused');
            if (isUserCancelled) {
                console.info('User cancelled signature request.');
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Signature request cancelled');
            } else {
                console.error('Login error:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(errMessage || 'Authentication failed');
            }
            return null;
        } finally{
            setIsLoading(false);
        }
    }, [
        isConnected,
        effectiveAddress,
        scheduleRefresh,
        preloadedNonce,
        nonceTimestamp,
        resolveSignerApi
    ]);
    const getValidToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
        const stored = undefined;
    }, [
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b099d071._.js.map