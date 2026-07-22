(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/SongCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SongCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$contractHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/contractHelper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPlayerPlay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPlayerPlay$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconPlayerPlay.mjs [app-client] (ecmascript) <export default as IconPlayerPlay>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPlayerPause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPlayerPause$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconPlayerPause.mjs [app-client] (ecmascript) <export default as IconPlayerPause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconLoader2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconLoader2$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconLoader2.mjs [app-client] (ecmascript) <export default as IconLoader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDiamond$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconDiamond$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDiamond.mjs [app-client] (ecmascript) <export default as IconDiamond>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDiamondFilled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconDiamondFilled$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDiamondFilled.mjs [app-client] (ecmascript) <export default as IconDiamondFilled>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDisc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconDisc$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDisc.mjs [app-client] (ecmascript) <export default as IconDisc>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Providers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AudioProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AudioProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
function SongCard({ tokenId, name, artist, imageUrl, audioUrl, genre: _genre, price, onPlay, isPlaying = false, navigateOnClick = false, is_owned = false, playCount, isAlbum = false, trackCount = 0, albumTracks = [], onPlayTrack }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const { address, isConnected, lucid } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCardano"])();
    const { isAuthenticated, login, accessToken, playerState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AudioProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudio"])();
    const [isMinting, setIsMinting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [hasOwned, setHasOwned] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(is_owned);
    const [mintData, setMintData] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState({
        minted: 0,
        max: 0
    });
    const [uploaderAddress, setUploaderAddress] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [albumId, setAlbumId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [ticker, setTicker] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [isHovered, setIsHovered] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [isLongPressed, setIsLongPressed] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [isExpanded, setIsExpanded] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [titleScrollAmount, setTitleScrollAmount] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(0);
    const [artistScrollAmount, setArtistScrollAmount] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(0);
    const titleContainerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const titleTextRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const artistContainerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const artistTextRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const timerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const hasLongPressedRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(false);
    const cardRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const lastClickTimeRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(0);
    const measureScrolls = ()=>{
        if (titleContainerRef.current && titleTextRef.current) {
            const cWidth = titleContainerRef.current.clientWidth;
            const tWidth = titleTextRef.current.scrollWidth;
            setTitleScrollAmount(tWidth > cWidth ? tWidth - cWidth : 0);
        }
        if (artistContainerRef.current && artistTextRef.current) {
            const cWidth = artistContainerRef.current.clientWidth;
            const tWidth = artistTextRef.current.scrollWidth;
            setArtistScrollAmount(tWidth > cWidth ? tWidth - cWidth : 0);
        }
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "SongCard.useEffect": ()=>{
            measureScrolls();
        }
    }["SongCard.useEffect"], [
        name,
        artist
    ]);
    const handleTouchStart = ()=>{
        hasLongPressedRef.current = false;
        timerRef.current = setTimeout(()=>{
            setIsLongPressed(true);
            hasLongPressedRef.current = true;
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }, 500);
    };
    const handleTouchEnd = (e)=>{
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (hasLongPressedRef.current) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsLongPressed(false);
    };
    const handleTouchCancel = ()=>{
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setIsLongPressed(false);
    };
    const handleTouchMove = ()=>{
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };
    const handleMouseEnter = ()=>{
        setIsHovered(true);
        measureScrolls();
    };
    const handleMouseLeave = ()=>{
        setIsHovered(false);
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "SongCard.useEffect": ()=>{
            if (is_owned) {
                setHasOwned(true);
            } else {
                const checkBack = {
                    "SongCard.useEffect.checkBack": async ()=>{
                        if (!address) return;
                        try {
                            const authData = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('doba_auth_data') : "TURBOPACK unreachable";
                            const headers = {};
                            if (authData) {
                                const parsedAuth = JSON.parse(authData);
                                if (parsedAuth && parsedAuth.accessToken) {
                                    headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`;
                                }
                            }
                            const res = await fetch(`/api-backend/songs/${tokenId}`, {
                                headers
                            });
                            if (res.ok) {
                                const data = await res.json();
                                setHasOwned(!!data.is_owned);
                                if (data.uploader_address) {
                                    setUploaderAddress(data.uploader_address);
                                }
                                if (data.album_id !== undefined) {
                                    setAlbumId(data.album_id);
                                }
                                if (data.ticker) {
                                    setTicker(data.ticker);
                                }
                            }
                        } catch (e) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('SongCard: Error checking ownership', e);
                        }
                    }
                }["SongCard.useEffect.checkBack"];
                checkBack();
            }
        }
    }["SongCard.useEffect"], [
        is_owned,
        address,
        tokenId
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "SongCard.useEffect": ()=>{
            const fetchMints = {
                "SongCard.useEffect.fetchMints": async ()=>{
                    try {
                        const res = await fetch(`/api-backend/songs/${tokenId}`);
                        if (res.ok) {
                            const data = await res.json();
                            setMintData({
                                minted: Number(data.mint_count || 0),
                                max: Number(data.max_supply || 0)
                            });
                            if (data.uploader_address) {
                                setUploaderAddress(data.uploader_address);
                            }
                            if (data.album_id !== undefined) {
                                setAlbumId(data.album_id);
                            }
                            if (data.ticker) {
                                setTicker(data.ticker);
                            }
                        }
                    } catch (err) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Error fetching mint data', err);
                    }
                }
            }["SongCard.useEffect.fetchMints"];
            fetchMints();
        }
    }["SongCard.useEffect"], [
        tokenId
    ]);
    const handleMint = async (e)=>{
        e.stopPropagation();
        if (!isAuthenticated) {
            login();
            return;
        }
        if (hasOwned) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info("You already own this track! Check your library.");
            return;
        }
        // Check if sold out
        if (mintData.max > 0 && mintData.minted >= mintData.max) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("This edition is sold out!");
            return;
        }
        const targetUploader = uploaderAddress;
        if (!targetUploader) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Creator address not found. Please try again.");
            return;
        }
        setIsMinting(true);
        const mainToast = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].loading(`Collecting "${name}"...`);
        const unownedTracks = isAlbum ? (albumTracks || []).filter((t)=>!t.is_owned) : [];
        if (isAlbum && unownedTracks.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info("You already own all tracks in this album!", {
                id: mainToast
            });
            setIsMinting(false);
            return;
        }
        try {
            if (!lucid) throw new Error("Cardano wallet not connected or initialized");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].loading(`Creating, signing and submitting transaction...`, {
                id: mainToast
            });
            let txHash;
            if (isAlbum) {
                txHash = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$contractHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buyAlbumFractionsOnChain"])(lucid, unownedTracks.map((t)=>({
                        token_id: t.token_id,
                        uploader_address: t.uploader_address || targetUploader,
                        ticker: t.ticker,
                        price: t.price
                    })));
            } else {
                txHash = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$contractHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buyFractionOnChain"])(lucid, {
                    token_id: tokenId,
                    uploader_address: targetUploader,
                    album_id: albumId,
                    ticker: ticker || undefined
                });
            }
            // Update local state immediately
            setHasOwned(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-bold",
                        children: [
                            '"',
                            name,
                            '" collected!'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SongCard.tsx",
                        lineNumber: 271,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPLORER_URL"]}/tx/${txHash}`,
                        target: "_blank",
                        className: "text-[10px] text-cyber-pink hover:underline flex items-center gap-1",
                        children: "View on Explorer"
                    }, void 0, false, {
                        fileName: "[project]/components/SongCard.tsx",
                        lineNumber: 272,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SongCard.tsx",
                lineNumber: 270,
                columnNumber: 9
            }, this), {
                id: mainToast
            });
            // Record mint in backend
            if (isAlbum) {
                for (const track of unownedTracks){
                    try {
                        if (isAuthenticated && accessToken) {
                            await fetch(`/api-backend/mints`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${accessToken}`
                                },
                                body: JSON.stringify({
                                    track_id: track.token_id,
                                    tx_hash: txHash
                                })
                            });
                        }
                    } catch (err) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to record album track mint in backend', track.token_id, err);
                    }
                }
            } else {
                try {
                    if (isAuthenticated && accessToken) {
                        await fetch(`/api-backend/mints`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({
                                track_id: tokenId,
                                tx_hash: txHash
                            })
                        });
                    }
                } catch (err) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to record mint in backend', err);
                }
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Mint Error', error);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$contractHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUserDeclinedTxError"])(error)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('You declined the transaction.', {
                    id: mainToast
                });
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$contractHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTxError"])(error), {
                    id: mainToast
                });
            }
        } finally{
            setIsMinting(false);
        }
    };
    const handleClick = (e)=>{
        if (hasLongPressedRef.current) {
            return;
        }
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (now - lastClickTimeRef.current < DOUBLE_TAP_DELAY) {
            e.preventDefault();
            e.stopPropagation();
            handleMint(e);
            lastClickTimeRef.current = 0;
            return;
        }
        lastClickTimeRef.current = now;
        if (isAlbum) {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded((prev)=>!prev);
            return;
        }
        if (navigateOnClick) {
            router.push(`/${locale}/track/${tokenId}`);
            return;
        }
        if (!isConnected) {
            login();
            return;
        }
        onPlay?.();
    };
    const currentPlayingId = playerState?.currentTrack?.token_id || playerState?.currentTrack?.id;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: cardRef,
                onClick: handleClick,
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                onTouchStart: handleTouchStart,
                onTouchEnd: handleTouchEnd,
                onTouchCancel: handleTouchCancel,
                onTouchMove: handleTouchMove,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group relative flex flex-col p-3 rounded-lg transition-all duration-300 cursor-pointer select-none", "bg-black/[0.03] dark:bg-white/[0.03] border border-[#f0f0f0] dark:border-white/5", "hover:bg-black/[0.06] dark:hover:bg-white/[0.06] hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg dark:hover:shadow-black/40", isLongPressed && "scale-[0.97] duration-150", isAlbum && isExpanded && "border-b-0 rounded-b-none"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full aspect-square flex-shrink-0",
                        children: [
                            isAlbum && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 transform translate-x-2 -translate-y-2 scale-[0.96] bg-black/[0.04] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-md transition-transform duration-300 group-hover:translate-x-2.5 group-hover:-translate-y-2.5 -z-10"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 397,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 transform translate-x-1 -translate-y-1 scale-[0.98] bg-black/[0.08] dark:bg-white/[0.08] border border-black/10 dark:border-white/10 rounded-md transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-2.5 -z-10"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 399,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-full h-full rounded-md overflow-hidden z-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: (imageUrl || '').replace('ipfs://', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'),
                                        alt: name,
                                        className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 405,
                                        columnNumber: 13
                                    }, this),
                                    onPlay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onPlay();
                                        },
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute right-3 bottom-3 z-30 w-10 h-10 bg-lavender hover:bg-lavender/90 hover:scale-105 active:scale-95 text-black rounded-full flex items-center justify-center transition-all duration-300 transform translate-y-2 opacity-0", "group-hover:translate-y-0 group-hover:opacity-100", isPlaying && "translate-y-0 opacity-100"),
                                        children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPlayerPause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPlayerPause$3e$__["IconPlayerPause"], {
                                            size: 18,
                                            className: "fill-black text-black"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SongCard.tsx",
                                            lineNumber: 426,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPlayerPlay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPlayerPlay$3e$__["IconPlayerPlay"], {
                                            size: 18,
                                            className: "fill-black text-black ml-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SongCard.tsx",
                                            lineNumber: 428,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 413,
                                        columnNumber: 15
                                    }, this),
                                    playCount !== undefined && playCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 rounded flex-shrink-0",
                                        children: [
                                            isAlbum ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDisc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconDisc$3e$__["IconDisc"], {
                                                size: 10,
                                                className: "text-white/80 animate-[spin_4s_linear_infinite]"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SongCard.tsx",
                                                lineNumber: 437,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPlayerPlay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPlayerPlay$3e$__["IconPlayerPlay"], {
                                                size: 8,
                                                className: "fill-white/80 text-white/80"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SongCard.tsx",
                                                lineNumber: 439,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[8px] font-mono font-bold text-white/80",
                                                children: playCount >= 1000 ? `${(playCount / 1000).toFixed(1)}k` : playCount
                                            }, void 0, false, {
                                                fileName: "[project]/components/SongCard.tsx",
                                                lineNumber: 441,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 435,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-2 left-2 z-20",
                                        children: mintData.max > 0 && mintData.minted >= mintData.max ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDiamondFilled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconDiamondFilled$3e$__["IconDiamondFilled"], {
                                            size: 22,
                                            className: "text-[#FF1F8A]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SongCard.tsx",
                                            lineNumber: 450,
                                            columnNumber: 17
                                        }, this) : hasOwned ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDiamondFilled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconDiamondFilled$3e$__["IconDiamondFilled"], {
                                            size: 22,
                                            className: "text-[#1DB954]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SongCard.tsx",
                                            lineNumber: 452,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            disabled: isMinting,
                                            onClick: handleMint,
                                            className: "text-white/70 hover:text-[#FF1F8A] transition-colors duration-200",
                                            children: isMinting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconLoader2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconLoader2$3e$__["IconLoader2"], {
                                                size: 22,
                                                className: "animate-spin text-[#FF1F8A]"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SongCard.tsx",
                                                lineNumber: 460,
                                                columnNumber: 32
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDiamond$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconDiamond$3e$__["IconDiamond"], {
                                                size: 22
                                            }, void 0, false, {
                                                fileName: "[project]/components/SongCard.tsx",
                                                lineNumber: 460,
                                                columnNumber: 100
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SongCard.tsx",
                                            lineNumber: 454,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 448,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SongCard.tsx",
                                lineNumber: 404,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SongCard.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex flex-col gap-1 px-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: titleContainerRef,
                                className: "overflow-hidden whitespace-nowrap w-full relative",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    ref: titleTextRef,
                                    style: {
                                        '--scroll-x': `-${titleScrollAmount}px`
                                    },
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-block font-display font-bold text-sm text-black dark:text-white leading-tight group-hover:text-black dark:group-hover:text-lavender transition-colors duration-200", titleScrollAmount > 0 && (isHovered || isPlaying || isLongPressed) ? "animate-marquee-dynamic overflow-visible" : "truncate w-full"),
                                    children: name
                                }, void 0, false, {
                                    fileName: "[project]/components/SongCard.tsx",
                                    lineNumber: 470,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/SongCard.tsx",
                                lineNumber: 469,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-2 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: artistContainerRef,
                                        className: "overflow-hidden whitespace-nowrap flex-grow relative min-w-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            ref: artistTextRef,
                                            style: {
                                                '--scroll-x': `-${artistScrollAmount}px`
                                            },
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-block text-[10px] text-black/50 dark:text-white/50 font-sans font-medium uppercase tracking-[1px]", artistScrollAmount > 0 && (isHovered || isPlaying || isLongPressed) ? "animate-marquee-dynamic overflow-visible" : "truncate w-full"),
                                            children: artist
                                        }, void 0, false, {
                                            fileName: "[project]/components/SongCard.tsx",
                                            lineNumber: 485,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 484,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-sans font-bold text-purple-600 dark:text-[#B794F4] flex-shrink-0",
                                        children: isAlbum ? albumTracks && albumTracks.length > 0 ? `${albumTracks.filter((t)=>!t.is_owned).reduce((sum, t)=>sum + Number(t.price || 5), 0)} ADA` : `${Number(price || 5) * trackCount} ADA` : `${price || '5'} ADA`
                                    }, void 0, false, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 498,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SongCard.tsx",
                                lineNumber: 483,
                                columnNumber: 11
                            }, this),
                            isAlbum && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mt-0.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] font-sans font-semibold tracking-wider text-black/40 dark:text-white/40 uppercase",
                                        children: [
                                            trackCount,
                                            " TRACKS"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 510,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[9px] font-sans font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase transition-transform duration-300", isExpanded && "rotate-180"),
                                        children: "▾"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 513,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SongCard.tsx",
                                lineNumber: 509,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SongCard.tsx",
                        lineNumber: 468,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SongCard.tsx",
                lineNumber: 375,
                columnNumber: 7
            }, this),
            isAlbum && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("overflow-hidden transition-all duration-300 ease-in-out", isExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border border-t-0 border-[#f0f0f0] dark:border-white/5 rounded-b-lg bg-black/[0.02] dark:bg-white/[0.02] px-3 pb-3 pt-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-y-auto max-h-[260px] space-y-0.5 custom-scrollbar",
                        children: albumTracks.map((t, index)=>{
                            const isTrackPlaying = playerState?.isPlaying && (currentPlayingId === t.token_id || currentPlayingId === t.id);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    if (onPlayTrack) {
                                        onPlayTrack(t);
                                    }
                                },
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-between py-2 px-2 rounded text-[11px] cursor-pointer transition-colors w-full min-w-0", isTrackPlaying ? "bg-purple-600/10 dark:bg-[#B794F4]/15 text-purple-600 dark:text-[#B794F4] font-semibold" : "hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2.5 min-w-0 mr-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-black/35 dark:text-white/35 text-[9px] flex-shrink-0 w-4 text-right",
                                                children: index + 1
                                            }, void 0, false, {
                                                fileName: "[project]/components/SongCard.tsx",
                                                lineNumber: 553,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate font-medium",
                                                children: t.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/SongCard.tsx",
                                                lineNumber: 554,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 552,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-shrink-0",
                                        children: isTrackPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPlayerPause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPlayerPause$3e$__["IconPlayerPause"], {
                                            size: 12,
                                            className: "text-cyber-pink fill-cyber-pink"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SongCard.tsx",
                                            lineNumber: 558,
                                            columnNumber: 25
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPlayerPlay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPlayerPlay$3e$__["IconPlayerPlay"], {
                                            size: 12,
                                            className: "text-black/25 dark:text-white/25"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SongCard.tsx",
                                            lineNumber: 560,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/SongCard.tsx",
                                        lineNumber: 556,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, t.token_id || t.id, true, {
                                fileName: "[project]/components/SongCard.tsx",
                                lineNumber: 537,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/SongCard.tsx",
                        lineNumber: 533,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/SongCard.tsx",
                    lineNumber: 532,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/SongCard.tsx",
                lineNumber: 526,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SongCard.tsx",
        lineNumber: 374,
        columnNumber: 5
    }, this);
}
_s(SongCard, "rosJWsR9ibZnPK3C/8Tlsx1f5pU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCardano"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AudioProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudio"]
    ];
});
_c = SongCard;
var _c;
__turbopack_context__.k.register(_c, "SongCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MarketplaceGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MarketplaceGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SongCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SongCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const API_URL = '/api-backend';
const TRANSIENT_HTTP_STATUSES = new Set([
    500,
    502,
    503,
    504
]);
const delay = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
function MarketplaceGrid({ onPlay, currentTrackId, isPlaying, searchQuery = '', genre = '', limit = 24, isSidebarOpen = false, splitPlaylist = false }) {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('marketplace');
    const tHome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('home');
    const tLibrary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('library');
    const [tracks, setTracks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingMore, setLoadingMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasMore, setHasMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [offset, setOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [fetchError, setFetchError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchTracks = async (isLoadMore = false)=>{
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);
        try {
            setFetchError(null);
            const currentOffset = isLoadMore ? offset + limit : 0;
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (genre && genre !== 'All') params.append('genre', genre);
            params.append('limit', limit.toString());
            params.append('offset', currentOffset.toString());
            const fetchUrl = `${API_URL.replace(/\/$/, '')}/songs?${params.toString()}`;
            const headers = {};
            const authData = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('doba_auth_data') : "TURBOPACK unreachable";
            if (authData && authData !== 'null') {
                try {
                    const parsedAuth = JSON.parse(authData);
                    if (parsedAuth && parsedAuth.accessToken) {
                        headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`;
                    }
                } catch (e) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to parse auth data for tracks fetch', e);
                }
            }
            const maxAttempts = 3;
            let lastStatus = null;
            let lastStatusText = '';
            let lastErrorBody = '';
            let responseData = null;
            for(let attempt = 1; attempt <= maxAttempts; attempt++){
                const attemptHeaders = {
                    ...headers
                };
                // If upstream keeps failing and we have auth attached, try a no-auth request once.
                if (attempt === 2 && attemptHeaders['Authorization']) {
                    delete attemptHeaders['Authorization'];
                }
                const res = await fetch(fetchUrl, {
                    headers: attemptHeaders
                });
                if (res.ok) {
                    responseData = await res.json();
                    break;
                }
                lastStatus = res.status;
                lastStatusText = res.statusText;
                lastErrorBody = await res.text().catch(()=>'');
                const shouldRetry = TRANSIENT_HTTP_STATUSES.has(res.status) && attempt < maxAttempts;
                if (!shouldRetry) {
                    break;
                }
                await delay(attempt * 400);
            }
            if (responseData) {
                const data = responseData;
                if (isLoadMore) {
                    setTracks((prev)=>[
                            ...prev,
                            ...data
                        ]);
                    setOffset(currentOffset);
                } else {
                    setTracks(data);
                    setOffset(0);
                }
                setHasMore(data.length === limit);
            } else {
                const status = lastStatus ?? 0;
                const statusText = lastStatusText || 'Request failed';
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error(`Failed to fetch tracks: ${status} ${statusText}`, lastErrorBody ? {
                    responseBody: lastErrorBody,
                    fetchUrl
                } : {
                    fetchUrl
                });
                setFetchError(status >= 500 ? 'Service temporarily unavailable. Please try again shortly.' : 'Unable to load tracks right now.');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to fetch tracks:', error?.message || error);
            setFetchError('Network error while loading tracks. Please retry.');
        } finally{
            setLoading(false);
            setLoadingMore(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarketplaceGrid.useEffect": ()=>{
            fetchTracks();
        }
    }["MarketplaceGrid.useEffect"], [
        searchQuery,
        genre
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid gap-6", isSidebarOpen ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"),
            children: [
                ...Array(12)
            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "aspect-[3/4] bg-midnight/5 dark:bg-white/5 animate-pulse"
                }, i, false, {
                    fileName: "[project]/components/MarketplaceGrid.tsx",
                    lineNumber: 168,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/MarketplaceGrid.tsx",
            lineNumber: 161,
            columnNumber: 7
        }, this);
    }
    if (!tracks.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-midnight/[0.02] dark:bg-white/[0.02] border border-white/5 p-20 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-midnight/70 dark:text-white/40 italic text-sm",
                children: fetchError || t('noSongs')
            }, void 0, false, {
                fileName: "[project]/components/MarketplaceGrid.tsx",
                lineNumber: 177,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/MarketplaceGrid.tsx",
            lineNumber: 176,
            columnNumber: 7
        }, this);
    }
    // Filter out any child tracks (tracks that belong to an album)
    const mainReleases = tracks.filter((t)=>!t.album_id);
    // Identify token_ids that act as album parents (i.e. some track in the DB has it as its album_id)
    const albumIds = new Set(tracks.filter((t)=>t.album_id).map((t)=>t.album_id));
    // Separate singles and albums
    const singles = mainReleases.filter((t)=>!albumIds.has(t.token_id));
    const albums = mainReleases.filter((t)=>albumIds.has(t.token_id));
    const isReleaseOwned = (track)=>{
        if (albumIds.has(track.token_id)) {
            const albumTracksList = tracks.filter((t)=>t.album_id === track.token_id);
            return albumTracksList.length > 0 && albumTracksList.every((t)=>t.is_owned);
        }
        return track.is_owned;
    };
    const collectedTracks = splitPlaylist ? mainReleases.filter(isReleaseOwned) : [];
    const discoverSingles = splitPlaylist ? singles.filter((t)=>!t.is_owned) : singles;
    const discoverAlbums = albums.filter((t)=>!isReleaseOwned(t));
    // Helper function to prepare album props
    const getSongCardProps = (track)=>{
        const isAlbum = albumIds.has(track.token_id);
        const albumTracksList = isAlbum ? tracks.filter((t)=>t.album_id === track.token_id) : [];
        const trackCount = isAlbum ? albumTracksList.length : 0;
        const playCount = isAlbum ? (track.play_count || 0) + albumTracksList.reduce((sum, t)=>sum + (t.play_count || 0), 0) : track.play_count;
        return {
            isAlbum,
            trackCount,
            albumTracks: albumTracksList,
            playCount
        };
    };
    const gridClass = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid gap-6", isSidebarOpen ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            splitPlaylist && collectedTracks.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-midnight dark:text-white",
                                children: tLibrary('title')
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 234,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: gridClass,
                                children: collectedTracks.map((track)=>{
                                    const cardProps = getSongCardProps(track);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SongCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        tokenId: track.token_id,
                                        name: track.name,
                                        artist: track.artist,
                                        imageUrl: track.image_url,
                                        audioUrl: track.audio_url,
                                        genre: track.genre,
                                        price: track.price,
                                        onPlay: onPlay ? ()=>onPlay(track, tracks) : undefined,
                                        isPlaying: isPlaying && currentTrackId === track.token_id,
                                        is_owned: cardProps.isAlbum ? cardProps.albumTracks.every((t)=>t.is_owned) : track.is_owned,
                                        playCount: cardProps.playCount,
                                        isAlbum: cardProps.isAlbum,
                                        trackCount: cardProps.trackCount,
                                        albumTracks: cardProps.albumTracks,
                                        onPlayTrack: onPlay ? (subTrack)=>onPlay(subTrack, tracks) : undefined
                                    }, track.token_id, false, {
                                        fileName: "[project]/components/MarketplaceGrid.tsx",
                                        lineNumber: 239,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 235,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MarketplaceGrid.tsx",
                        lineNumber: 233,
                        columnNumber: 11
                    }, this),
                    discoverSingles.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 pt-6 border-t border-midnight/10 dark:border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-midnight dark:text-white",
                                children: tHome('discoverMusic')
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 265,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: gridClass,
                                children: discoverSingles.map((track)=>{
                                    const cardProps = getSongCardProps(track);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SongCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        tokenId: track.token_id,
                                        name: track.name,
                                        artist: track.artist,
                                        imageUrl: track.image_url,
                                        audioUrl: track.audio_url,
                                        genre: track.genre,
                                        price: track.price,
                                        onPlay: onPlay ? ()=>onPlay(track, tracks) : undefined,
                                        isPlaying: isPlaying && currentTrackId === track.token_id,
                                        is_owned: track.is_owned,
                                        playCount: cardProps.playCount,
                                        isAlbum: false
                                    }, track.token_id, false, {
                                        fileName: "[project]/components/MarketplaceGrid.tsx",
                                        lineNumber: 270,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 266,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MarketplaceGrid.tsx",
                        lineNumber: 264,
                        columnNumber: 13
                    }, this),
                    discoverAlbums.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 pt-6 border-t border-midnight/10 dark:border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-midnight dark:text-white",
                                children: "Top Albums"
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 294,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: gridClass,
                                children: discoverAlbums.map((track)=>{
                                    const cardProps = getSongCardProps(track);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SongCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        tokenId: track.token_id,
                                        name: track.name,
                                        artist: track.artist,
                                        imageUrl: track.image_url,
                                        audioUrl: track.audio_url,
                                        genre: track.genre,
                                        price: track.price,
                                        onPlay: onPlay ? ()=>onPlay(track, tracks) : undefined,
                                        isPlaying: isPlaying && currentTrackId === track.token_id,
                                        is_owned: cardProps.albumTracks.every((t)=>t.is_owned),
                                        playCount: cardProps.playCount,
                                        isAlbum: true,
                                        trackCount: cardProps.trackCount,
                                        albumTracks: cardProps.albumTracks,
                                        onPlayTrack: onPlay ? (subTrack)=>onPlay(subTrack, tracks) : undefined
                                    }, track.token_id, false, {
                                        fileName: "[project]/components/MarketplaceGrid.tsx",
                                        lineNumber: 299,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 295,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MarketplaceGrid.tsx",
                        lineNumber: 293,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    discoverSingles.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            splitPlaylist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-midnight dark:text-white mb-4",
                                children: tHome('discoverMusic')
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 329,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: gridClass,
                                children: discoverSingles.map((track)=>{
                                    const cardProps = getSongCardProps(track);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SongCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        tokenId: track.token_id,
                                        name: track.name,
                                        artist: track.artist,
                                        imageUrl: track.image_url,
                                        audioUrl: track.audio_url,
                                        genre: track.genre,
                                        price: track.price,
                                        onPlay: onPlay ? ()=>onPlay(track, tracks) : undefined,
                                        isPlaying: isPlaying && currentTrackId === track.token_id,
                                        is_owned: track.is_owned,
                                        playCount: cardProps.playCount,
                                        isAlbum: false
                                    }, track.token_id, false, {
                                        fileName: "[project]/components/MarketplaceGrid.tsx",
                                        lineNumber: 335,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 331,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MarketplaceGrid.tsx",
                        lineNumber: 327,
                        columnNumber: 13
                    }, this),
                    discoverAlbums.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 pt-6 border-t border-midnight/10 dark:border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-midnight dark:text-white",
                                children: "Top Albums"
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 359,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: gridClass,
                                children: discoverAlbums.map((track)=>{
                                    const cardProps = getSongCardProps(track);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SongCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        tokenId: track.token_id,
                                        name: track.name,
                                        artist: track.artist,
                                        imageUrl: track.image_url,
                                        audioUrl: track.audio_url,
                                        genre: track.genre,
                                        price: track.price,
                                        onPlay: onPlay ? ()=>onPlay(track, tracks) : undefined,
                                        isPlaying: isPlaying && currentTrackId === track.token_id,
                                        is_owned: cardProps.albumTracks.every((t)=>t.is_owned),
                                        playCount: cardProps.playCount,
                                        isAlbum: true,
                                        trackCount: cardProps.trackCount,
                                        albumTracks: cardProps.albumTracks,
                                        onPlayTrack: onPlay ? (subTrack)=>onPlay(subTrack, tracks) : undefined
                                    }, track.token_id, false, {
                                        fileName: "[project]/components/MarketplaceGrid.tsx",
                                        lineNumber: 364,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/MarketplaceGrid.tsx",
                                lineNumber: 360,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MarketplaceGrid.tsx",
                        lineNumber: 358,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true),
            hasMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center pt-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>fetchTracks(true),
                    disabled: loadingMore,
                    className: "px-8 py-3 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-50",
                    children: loadingMore ? 'Loading...' : 'Load More'
                }, void 0, false, {
                    fileName: "[project]/components/MarketplaceGrid.tsx",
                    lineNumber: 392,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/MarketplaceGrid.tsx",
                lineNumber: 391,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MarketplaceGrid.tsx",
        lineNumber: 229,
        columnNumber: 5
    }, this);
}
_s(MarketplaceGrid, "f3r+qr+EvfnY8TL4jx5V7btWh5E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"]
    ];
});
_c = MarketplaceGrid;
var _c;
__turbopack_context__.k.register(_c, "MarketplaceGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/[locale]/(dashboard)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomeDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MarketplaceGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MarketplaceGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AudioProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AudioProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function HomeDashboard() {
    _s();
    const { playerState, handlePlayTrack, isSidebarOpen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AudioProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudio"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeDashboard.useEffect": ()=>setMounted(true)
    }["HomeDashboard.useEffect"], []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 animate-fade-in",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MarketplaceGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            splitPlaylist: true,
            isSidebarOpen: isSidebarOpen,
            currentTrackId: playerState.currentTrack?.id,
            isPlaying: playerState.isPlaying,
            onPlay: (track, tracks)=>handlePlayTrack({
                    id: track.token_id,
                    title: track.name,
                    creator: track.artist,
                    cover: track.image_url,
                    url: track.streaming_url || track.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
                    collaborators: 0,
                    price: track.price,
                    genre: track.genre,
                    description: track.description,
                    uploader_address: track.uploader_address
                }, tracks.map((t)=>({
                        id: t.token_id,
                        title: t.name,
                        creator: t.artist,
                        cover: t.image_url,
                        url: t.streaming_url || t.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
                        collaborators: 0,
                        price: t.price,
                        genre: t.genre,
                        description: t.description,
                        uploader_address: t.uploader_address
                    })))
        }, void 0, false, {
            fileName: "[project]/app/[locale]/(dashboard)/page.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/[locale]/(dashboard)/page.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_s(HomeDashboard, "CfUnu75umQg7gZcVAY+TilRni88=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AudioProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudio"]
    ];
});
_c = HomeDashboard;
var _c;
__turbopack_context__.k.register(_c, "HomeDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDiamond.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>IconDiamond
]);
/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$createReactComponent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/createReactComponent.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            "d": "M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5",
            "key": "svg-0"
        }
    ],
    [
        "path",
        {
            "d": "M10 12l-2 -2.2l.6 -1",
            "key": "svg-1"
        }
    ]
];
const IconDiamond = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$createReactComponent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("outline", "diamond", "Diamond", __iconNode);
;
 //# sourceMappingURL=IconDiamond.mjs.map
}),
"[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDiamond.mjs [app-client] (ecmascript) <export default as IconDiamond>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IconDiamond",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDiamond$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDiamond$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDiamond.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDiamondFilled.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>IconDiamondFilled
]);
/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$createReactComponent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/createReactComponent.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            "d": "M18 4a1 1 0 0 1 .783 .378l.074 .108l3 5a1 1 0 0 1 -.032 1.078l-.08 .103l-8.53 9.533a1.7 1.7 0 0 1 -1.215 .51c-.4 0 -.785 -.14 -1.11 -.417l-.135 -.126l-8.5 -9.5a1 1 0 0 1 -.172 -1.067l.06 -.115l3.013 -5.022l.064 -.09a.982 .982 0 0 1 .155 -.154l.089 -.064l.088 -.05l.05 -.023l.06 -.025l.109 -.032l.112 -.02l.117 -.005h12zm-8.886 3.943a1 1 0 0 0 -1.371 .343l-.6 1l-.06 .116a1 1 0 0 0 .177 1.07l2 2.2l.09 .088a1 1 0 0 0 1.323 -.02l.087 -.09a1 1 0 0 0 -.02 -1.323l-1.501 -1.65l.218 -.363l.055 -.103a1 1 0 0 0 -.398 -1.268z",
            "key": "svg-0"
        }
    ]
];
const IconDiamondFilled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$createReactComponent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("filled", "diamond-filled", "DiamondFilled", __iconNode);
;
 //# sourceMappingURL=IconDiamondFilled.mjs.map
}),
"[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDiamondFilled.mjs [app-client] (ecmascript) <export default as IconDiamondFilled>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IconDiamondFilled",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDiamondFilled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDiamondFilled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDiamondFilled.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDisc.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>IconDisc
]);
/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$createReactComponent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/createReactComponent.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            "d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
            "key": "svg-0"
        }
    ],
    [
        "path",
        {
            "d": "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
            "key": "svg-1"
        }
    ],
    [
        "path",
        {
            "d": "M7 12a5 5 0 0 1 5 -5",
            "key": "svg-2"
        }
    ],
    [
        "path",
        {
            "d": "M12 17a5 5 0 0 0 5 -5",
            "key": "svg-3"
        }
    ]
];
const IconDisc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$createReactComponent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("outline", "disc", "Disc", __iconNode);
;
 //# sourceMappingURL=IconDisc.mjs.map
}),
"[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDisc.mjs [app-client] (ecmascript) <export default as IconDisc>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IconDisc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDisc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDisc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDisc.mjs [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_b3a31203._.js.map