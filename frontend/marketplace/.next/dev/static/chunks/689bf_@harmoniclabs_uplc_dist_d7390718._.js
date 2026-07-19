(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/interfaces/ToUPLC.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/interfaces/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/interfaces/ToUPLC.js [app-client] (ecmascript)"), exports);
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/ints.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unsafeForceUInt = exports.forceBigUInt = exports.canBeUInteger = void 0;
function canBeUInteger(something) {
    return typeof something === "bigint" && something >= BigInt(0) || typeof something === "number" && something === Math.round(Math.abs(something));
}
exports.canBeUInteger = canBeUInteger;
function forceBigUInt(toForce) {
    if (!canBeUInteger(toForce)) {
        // console.error( toForce );
        throw new Error("trying to convert an integer to an unsigned Integer, the number was negative");
    }
    return BigInt(toForce);
}
exports.forceBigUInt = forceBigUInt;
;
function unsafeForceUInt(toForce) {
    if (!canBeUInteger(toForce)) {
        // console.error( toForce );
        throw new Error("trying to convert an integer to an unsigned Integer, the number was negative");
    }
    return Number(toForce);
}
exports.unsafeForceUInt = unsafeForceUInt;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/UPLCVersion.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultUplcVersion = exports.UPLCVersion = void 0;
var ints_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/ints.js [app-client] (ecmascript)");
var UPLCVersion = function() {
    function UPLCVersion(major, minor, patch) {
        this._major = (0, ints_1.forceBigUInt)(major);
        this._minor = (0, ints_1.forceBigUInt)(minor);
        this._patch = (0, ints_1.forceBigUInt)(patch);
    }
    Object.defineProperty(UPLCVersion.prototype, "major", {
        get: function() {
            return this._major;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(UPLCVersion.prototype, "minor", {
        get: function() {
            return this._minor;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(UPLCVersion.prototype, "patch", {
        get: function() {
            return this._patch;
        },
        enumerable: false,
        configurable: true
    });
    ;
    UPLCVersion.prototype.isV3Friendly = function() {
        // ^1.1.0 || >= 2.*.*
        return this.major === BigInt(1) ? this.minor >= 1 : this.major >= 2;
    };
    UPLCVersion.prototype.toString = function() {
        return "".concat(this.major, ".").concat(this.minor, ".").concat(this.patch);
    };
    UPLCVersion.fromString = function(str) {
        var _a = __read(str.split("."), 3), a = _a[0], b = _a[1], c = _a[2];
        return new UPLCVersion(BigInt(a), BigInt(b), BigInt(c));
    };
    return UPLCVersion;
}();
exports.UPLCVersion = UPLCVersion;
exports.defaultUplcVersion = new UPLCVersion(1, 1, 0);
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/UPLCProgram.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UPLCProgram = void 0;
var UPLCVersion_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/UPLCVersion.js [app-client] (ecmascript)");
var UPLCProgram = function() {
    function UPLCProgram(version, body) {
        if (Array.isArray(version)) {
            this._version = new (UPLCVersion_1.UPLCVersion.bind.apply(UPLCVersion_1.UPLCVersion, __spreadArray([
                void 0
            ], __read(version), false)))();
        } else {
            this._version = version;
        }
        this._body = body;
    }
    Object.defineProperty(UPLCProgram.prototype, "version", {
        get: function() {
            return this._version;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(UPLCProgram.prototype, "body", {
        get: function() {
            return this._body;
        },
        enumerable: false,
        configurable: true
    });
    ;
    return UPLCProgram;
}();
exports.UPLCProgram = UPLCProgram;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.assert = void 0;
function assert(condition, errorMessage, addInfos) {
    var args = [];
    for(var _i = 3; _i < arguments.length; _i++){
        args[_i - 3] = arguments[_i];
    }
    if (condition) return;
    args.length > 0 && console.error.apply(console, __spreadArray([], __read(args), false));
    addInfos && console.error(addInfos);
    if (errorMessage instanceof Error) {
        throw errorMessage;
    }
    ;
    throw new Error(errorMessage);
}
exports.assert = assert;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCVar/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UPLCVar = void 0;
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var ints_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/ints.js [app-client] (ecmascript)");
var assert_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)");
var UPLCVar = function() {
    function UPLCVar(deBruijn) {
        this._deBruijn = (0, ints_1.forceBigUInt)(deBruijn);
        (0, assert_1.assert)(this._deBruijn >= BigInt(0), "invalid deBruijn index; while creating 'UPLCVar' instance, deBruijn index was: " + this._deBruijn);
    }
    Object.defineProperty(UPLCVar, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("0000");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UPLCVar.prototype, "deBruijn", {
        get: function() {
            return this._deBruijn;
        },
        enumerable: false,
        configurable: true
    });
    UPLCVar.prototype.clone = function() {
        return new UPLCVar(this.deBruijn);
    };
    return UPLCVar;
}();
exports.UPLCVar = UPLCVar;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Delay.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Delay = void 0;
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var Delay = function() {
    function Delay(toDelay) {
        this.delayedTerm = toDelay;
    }
    Object.defineProperty(Delay, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("0001");
        },
        enumerable: false,
        configurable: true
    });
    Delay.prototype.clone = function() {
        return new Delay(this.delayedTerm.clone());
    };
    return Delay;
}();
exports.Delay = Delay;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Lambda.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Lambda = void 0;
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var Lambda = function() {
    function Lambda(body) {
        this.body = body;
    }
    Object.defineProperty(Lambda, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("0010");
        },
        enumerable: false,
        configurable: true
    });
    Lambda.prototype.clone = function() {
        return new Lambda(this.body.clone());
    };
    return Lambda;
}();
exports.Lambda = Lambda;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/UPLCBuiltinTag.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.builtinTagFromString = exports.builtinTagToString = exports.isV2Supported = exports.isV1Supported = exports.getNRequiredForces = exports.isUPLCBuiltinTag = exports.UPLCBuiltinTag = void 0;
var assert_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)");
/**
 * to encode as 7-bits
 */ var UPLCBuiltinTag;
(function(UPLCBuiltinTag) {
    // integers monoidal operations
    UPLCBuiltinTag[UPLCBuiltinTag["addInteger"] = 0] = "addInteger";
    UPLCBuiltinTag[UPLCBuiltinTag["subtractInteger"] = 1] = "subtractInteger";
    UPLCBuiltinTag[UPLCBuiltinTag["multiplyInteger"] = 2] = "multiplyInteger";
    UPLCBuiltinTag[UPLCBuiltinTag["divideInteger"] = 3] = "divideInteger";
    UPLCBuiltinTag[UPLCBuiltinTag["quotientInteger"] = 4] = "quotientInteger";
    UPLCBuiltinTag[UPLCBuiltinTag["remainderInteger"] = 5] = "remainderInteger";
    UPLCBuiltinTag[UPLCBuiltinTag["modInteger"] = 6] = "modInteger";
    // integers comparison operaitons
    UPLCBuiltinTag[UPLCBuiltinTag["equalsInteger"] = 7] = "equalsInteger";
    UPLCBuiltinTag[UPLCBuiltinTag["lessThanInteger"] = 8] = "lessThanInteger";
    UPLCBuiltinTag[UPLCBuiltinTag["lessThanEqualInteger"] = 9] = "lessThanEqualInteger";
    // bytestring operations
    UPLCBuiltinTag[UPLCBuiltinTag["appendByteString"] = 10] = "appendByteString";
    UPLCBuiltinTag[UPLCBuiltinTag["consByteString"] = 11] = "consByteString";
    UPLCBuiltinTag[UPLCBuiltinTag["sliceByteString"] = 12] = "sliceByteString";
    UPLCBuiltinTag[UPLCBuiltinTag["lengthOfByteString"] = 13] = "lengthOfByteString";
    UPLCBuiltinTag[UPLCBuiltinTag["indexByteString"] = 14] = "indexByteString";
    // bytestring comparison operations
    UPLCBuiltinTag[UPLCBuiltinTag["equalsByteString"] = 15] = "equalsByteString";
    UPLCBuiltinTag[UPLCBuiltinTag["lessThanByteString"] = 16] = "lessThanByteString";
    UPLCBuiltinTag[UPLCBuiltinTag["lessThanEqualsByteString"] = 17] = "lessThanEqualsByteString";
    // hashes
    UPLCBuiltinTag[UPLCBuiltinTag["sha2_256"] = 18] = "sha2_256";
    UPLCBuiltinTag[UPLCBuiltinTag["sha3_256"] = 19] = "sha3_256";
    UPLCBuiltinTag[UPLCBuiltinTag["blake2b_256"] = 20] = "blake2b_256";
    UPLCBuiltinTag[UPLCBuiltinTag["verifyEd25519Signature"] = 21] = "verifyEd25519Signature";
    // string operations
    UPLCBuiltinTag[UPLCBuiltinTag["appendString"] = 22] = "appendString";
    UPLCBuiltinTag[UPLCBuiltinTag["equalsString"] = 23] = "equalsString";
    UPLCBuiltinTag[UPLCBuiltinTag["encodeUtf8"] = 24] = "encodeUtf8";
    UPLCBuiltinTag[UPLCBuiltinTag["decodeUtf8"] = 25] = "decodeUtf8";
    // control flow
    UPLCBuiltinTag[UPLCBuiltinTag["ifThenElse"] = 26] = "ifThenElse";
    UPLCBuiltinTag[UPLCBuiltinTag["chooseUnit"] = 27] = "chooseUnit";
    // tracing
    UPLCBuiltinTag[UPLCBuiltinTag["trace"] = 28] = "trace";
    // data
    UPLCBuiltinTag[UPLCBuiltinTag["fstPair"] = 29] = "fstPair";
    UPLCBuiltinTag[UPLCBuiltinTag["sndPair"] = 30] = "sndPair";
    UPLCBuiltinTag[UPLCBuiltinTag["chooseList"] = 31] = "chooseList";
    UPLCBuiltinTag[UPLCBuiltinTag["mkCons"] = 32] = "mkCons";
    UPLCBuiltinTag[UPLCBuiltinTag["headList"] = 33] = "headList";
    UPLCBuiltinTag[UPLCBuiltinTag["tailList"] = 34] = "tailList";
    UPLCBuiltinTag[UPLCBuiltinTag["nullList"] = 35] = "nullList";
    UPLCBuiltinTag[UPLCBuiltinTag["chooseData"] = 36] = "chooseData";
    UPLCBuiltinTag[UPLCBuiltinTag["constrData"] = 37] = "constrData";
    UPLCBuiltinTag[UPLCBuiltinTag["mapData"] = 38] = "mapData";
    UPLCBuiltinTag[UPLCBuiltinTag["listData"] = 39] = "listData";
    UPLCBuiltinTag[UPLCBuiltinTag["iData"] = 40] = "iData";
    UPLCBuiltinTag[UPLCBuiltinTag["bData"] = 41] = "bData";
    UPLCBuiltinTag[UPLCBuiltinTag["unConstrData"] = 42] = "unConstrData";
    UPLCBuiltinTag[UPLCBuiltinTag["unMapData"] = 43] = "unMapData";
    UPLCBuiltinTag[UPLCBuiltinTag["unListData"] = 44] = "unListData";
    UPLCBuiltinTag[UPLCBuiltinTag["unIData"] = 45] = "unIData";
    UPLCBuiltinTag[UPLCBuiltinTag["unBData"] = 46] = "unBData";
    UPLCBuiltinTag[UPLCBuiltinTag["equalsData"] = 47] = "equalsData";
    UPLCBuiltinTag[UPLCBuiltinTag["mkPairData"] = 48] = "mkPairData";
    UPLCBuiltinTag[UPLCBuiltinTag["mkNilData"] = 49] = "mkNilData";
    UPLCBuiltinTag[UPLCBuiltinTag["mkNilPairData"] = 50] = "mkNilPairData";
    // Vasil (Plutus V2)
    UPLCBuiltinTag[UPLCBuiltinTag["serialiseData"] = 51] = "serialiseData";
    UPLCBuiltinTag[UPLCBuiltinTag["verifyEcdsaSecp256k1Signature"] = 52] = "verifyEcdsaSecp256k1Signature";
    UPLCBuiltinTag[UPLCBuiltinTag["verifySchnorrSecp256k1Signature"] = 53] = "verifySchnorrSecp256k1Signature";
    // Plutus V3
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G1_add"] = 54] = "bls12_381_G1_add";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G1_neg"] = 55] = "bls12_381_G1_neg";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G1_scalarMul"] = 56] = "bls12_381_G1_scalarMul";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G1_equal"] = 57] = "bls12_381_G1_equal";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G1_hashToGroup"] = 58] = "bls12_381_G1_hashToGroup";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G1_compress"] = 59] = "bls12_381_G1_compress";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G1_uncompress"] = 60] = "bls12_381_G1_uncompress";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G2_add"] = 61] = "bls12_381_G2_add";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G2_neg"] = 62] = "bls12_381_G2_neg";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G2_scalarMul"] = 63] = "bls12_381_G2_scalarMul";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G2_equal"] = 64] = "bls12_381_G2_equal";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G2_hashToGroup"] = 65] = "bls12_381_G2_hashToGroup";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G2_compress"] = 66] = "bls12_381_G2_compress";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_G2_uncompress"] = 67] = "bls12_381_G2_uncompress";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_millerLoop"] = 68] = "bls12_381_millerLoop";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_mulMlResult"] = 69] = "bls12_381_mulMlResult";
    UPLCBuiltinTag[UPLCBuiltinTag["bls12_381_finalVerify"] = 70] = "bls12_381_finalVerify";
    UPLCBuiltinTag[UPLCBuiltinTag["keccak_256"] = 71] = "keccak_256";
    UPLCBuiltinTag[UPLCBuiltinTag["blake2b_224"] = 72] = "blake2b_224";
    // bitwise
    UPLCBuiltinTag[UPLCBuiltinTag["integerToByteString"] = 73] = "integerToByteString";
    UPLCBuiltinTag[UPLCBuiltinTag["byteStringToInteger"] = 74] = "byteStringToInteger";
})(UPLCBuiltinTag = exports.UPLCBuiltinTag || (exports.UPLCBuiltinTag = {}));
function isUPLCBuiltinTag(tag) {
    return Math.round(Math.abs(tag)) === tag // tag is a non-negative integer
     && tag >= 0 && tag <= 74;
}
exports.isUPLCBuiltinTag = isUPLCBuiltinTag;
function getNRequiredForces(tag) {
    (0, assert_1.assert)(isUPLCBuiltinTag(tag), "in getNRequiredForces; the function is specific for UPLCBuiltinTags; input was: ".concat(tag));
    // tags from 0 to 25 and from 37 to 53 are all fixed in type; no forces requred
    if (tag <= 25 || // all fixed type after constrData 
    tag >= UPLCBuiltinTag.constrData) {
        return 0;
    }
    // tags that do have one type parameter; 1 force
    if (tag === UPLCBuiltinTag.ifThenElse || tag === UPLCBuiltinTag.chooseUnit || tag === UPLCBuiltinTag.trace || tag === UPLCBuiltinTag.mkCons || tag === UPLCBuiltinTag.headList || tag === UPLCBuiltinTag.tailList || tag === UPLCBuiltinTag.nullList || tag === UPLCBuiltinTag.chooseData) {
        return 1;
    }
    // tags that do have two types paramters; two forces
    if (tag === UPLCBuiltinTag.fstPair || tag === UPLCBuiltinTag.sndPair || tag === UPLCBuiltinTag.chooseList) {
        return 2;
    }
    throw new Error("'getNRequiredForces' did not match any tag; the input was: " + tag);
}
exports.getNRequiredForces = getNRequiredForces;
function isV1Supported(tag) {
    return isUPLCBuiltinTag(tag) && tag <= 50;
}
exports.isV1Supported = isV1Supported;
function isV2Supported(tag) {
    return isUPLCBuiltinTag(tag);
}
exports.isV2Supported = isV2Supported;
function builtinTagToString(tag) {
    switch(tag){
        case UPLCBuiltinTag.addInteger:
            return "addInteger";
        case UPLCBuiltinTag.subtractInteger:
            return "subtractInteger";
        case UPLCBuiltinTag.multiplyInteger:
            return "multiplyInteger";
        case UPLCBuiltinTag.divideInteger:
            return "divideInteger";
        case UPLCBuiltinTag.quotientInteger:
            return "quotientInteger";
        case UPLCBuiltinTag.remainderInteger:
            return "remainderInteger";
        case UPLCBuiltinTag.modInteger:
            return "modInteger";
        case UPLCBuiltinTag.equalsInteger:
            return "equalsInteger";
        case UPLCBuiltinTag.lessThanInteger:
            return "lessThanInteger";
        case UPLCBuiltinTag.lessThanEqualInteger:
            return "lessThanEqualsInteger";
        case UPLCBuiltinTag.appendByteString:
            return "appendByteString";
        case UPLCBuiltinTag.consByteString:
            return "consByteString";
        case UPLCBuiltinTag.sliceByteString:
            return "sliceByteString";
        case UPLCBuiltinTag.lengthOfByteString:
            return "lengthOfByteString";
        case UPLCBuiltinTag.indexByteString:
            return "indexByteString";
        case UPLCBuiltinTag.equalsByteString:
            return "equalsByteString";
        case UPLCBuiltinTag.lessThanByteString:
            return "lessThanByteString";
        case UPLCBuiltinTag.lessThanEqualsByteString:
            return "lessThanEqualsByteString";
        case UPLCBuiltinTag.sha2_256:
            return "sha2_256";
        case UPLCBuiltinTag.sha3_256:
            return "sha3_256";
        case UPLCBuiltinTag.blake2b_256:
            return "blake2b_256";
        case UPLCBuiltinTag.verifyEd25519Signature:
            return "verifyEd25519Signature";
        case UPLCBuiltinTag.appendString:
            return "appendString";
        case UPLCBuiltinTag.equalsString:
            return "equalsString";
        case UPLCBuiltinTag.encodeUtf8:
            return "encodeUtf8";
        case UPLCBuiltinTag.decodeUtf8:
            return "decodeUtf8";
        case UPLCBuiltinTag.ifThenElse:
            return "ifThenElse";
        case UPLCBuiltinTag.chooseUnit:
            return "chooseUnit";
        case UPLCBuiltinTag.trace:
            return "trace";
        case UPLCBuiltinTag.fstPair:
            return "fstPair";
        case UPLCBuiltinTag.sndPair:
            return "sndPair";
        case UPLCBuiltinTag.chooseList:
            return "chooseList";
        case UPLCBuiltinTag.mkCons:
            return "mkCons";
        case UPLCBuiltinTag.headList:
            return "headList";
        case UPLCBuiltinTag.tailList:
            return "tailList";
        case UPLCBuiltinTag.nullList:
            return "nullList";
        case UPLCBuiltinTag.chooseData:
            return "chooseData";
        case UPLCBuiltinTag.constrData:
            return "constrData";
        case UPLCBuiltinTag.mapData:
            return "mapData";
        case UPLCBuiltinTag.listData:
            return "listData";
        case UPLCBuiltinTag.iData:
            return "iData";
        case UPLCBuiltinTag.bData:
            return "bData";
        case UPLCBuiltinTag.unConstrData:
            return "unConstrData";
        case UPLCBuiltinTag.unMapData:
            return "unMapData";
        case UPLCBuiltinTag.unListData:
            return "unListData";
        case UPLCBuiltinTag.unIData:
            return "unIData";
        case UPLCBuiltinTag.unBData:
            return "unBData";
        case UPLCBuiltinTag.equalsData:
            return "equalsData";
        case UPLCBuiltinTag.mkPairData:
            return "mkPairData";
        case UPLCBuiltinTag.mkNilData:
            return "mkNilData";
        case UPLCBuiltinTag.mkNilPairData:
            return "mkNilPairData";
        case UPLCBuiltinTag.serialiseData:
            return "serialiseData";
        case UPLCBuiltinTag.verifyEcdsaSecp256k1Signature:
            return "verifyEcdsaSecp256k1Signature";
        case UPLCBuiltinTag.verifySchnorrSecp256k1Signature:
            return "verifySchnorrSecp256k1Signature";
        case UPLCBuiltinTag.bls12_381_G1_add:
            return "bls12_381_G1_add";
        case UPLCBuiltinTag.bls12_381_G1_neg:
            return "bls12_381_G1_neg";
        case UPLCBuiltinTag.bls12_381_G1_scalarMul:
            return "bls12_381_G1_scalarMul";
        case UPLCBuiltinTag.bls12_381_G1_equal:
            return "bls12_381_G1_equal";
        case UPLCBuiltinTag.bls12_381_G1_hashToGroup:
            return "bls12_381_G1_hashToGroup";
        case UPLCBuiltinTag.bls12_381_G1_compress:
            return "bls12_381_G1_compress";
        case UPLCBuiltinTag.bls12_381_G1_uncompress:
            return "bls12_381_G1_uncompress";
        case UPLCBuiltinTag.bls12_381_G2_add:
            return "bls12_381_G2_add";
        case UPLCBuiltinTag.bls12_381_G2_neg:
            return "bls12_381_G2_neg";
        case UPLCBuiltinTag.bls12_381_G2_scalarMul:
            return "bls12_381_G2_scalarMul";
        case UPLCBuiltinTag.bls12_381_G2_equal:
            return "bls12_381_G2_equal";
        case UPLCBuiltinTag.bls12_381_G2_hashToGroup:
            return "bls12_381_G2_hashToGroup";
        case UPLCBuiltinTag.bls12_381_G2_compress:
            return "bls12_381_G2_compress";
        case UPLCBuiltinTag.bls12_381_G2_uncompress:
            return "bls12_381_G2_uncompress";
        case UPLCBuiltinTag.bls12_381_millerLoop:
            return "bls12_381_millerLoop";
        case UPLCBuiltinTag.bls12_381_mulMlResult:
            return "bls12_381_mulMlResult";
        case UPLCBuiltinTag.bls12_381_finalVerify:
            return "bls12_381_finalVerify";
        case UPLCBuiltinTag.keccak_256:
            return "keccak_256";
        case UPLCBuiltinTag.blake2b_224:
            return "blake2b_224";
        case UPLCBuiltinTag.integerToByteString:
            return "integerToByteString";
        case UPLCBuiltinTag.byteStringToInteger:
            return "byteStringToInteger";
        default:
            // tag; // check that is of type 'never'
            return "";
    }
}
exports.builtinTagToString = builtinTagToString;
function builtinTagFromString(tag) {
    switch(tag.trim()){
        case "addInteger":
            return UPLCBuiltinTag.addInteger;
        case "subtractInteger":
            return UPLCBuiltinTag.subtractInteger;
        case "multiplyInteger":
            return UPLCBuiltinTag.multiplyInteger;
        case "divideInteger":
            return UPLCBuiltinTag.divideInteger;
        case "quotientInteger":
            return UPLCBuiltinTag.quotientInteger;
        case "remainderInteger":
            return UPLCBuiltinTag.remainderInteger;
        case "modInteger":
            return UPLCBuiltinTag.modInteger;
        case "equalsInteger":
            return UPLCBuiltinTag.equalsInteger;
        case "lessThanInteger":
            return UPLCBuiltinTag.lessThanInteger;
        case "lessThanEqualInteger":
            return UPLCBuiltinTag.lessThanEqualInteger;
        case "lessThanEqualsInteger":
            return UPLCBuiltinTag.lessThanEqualInteger;
        case "appendByteString":
            return UPLCBuiltinTag.appendByteString;
        case "consByteString":
            return UPLCBuiltinTag.consByteString;
        case "sliceByteString":
            return UPLCBuiltinTag.sliceByteString;
        case "lengthOfByteString":
            return UPLCBuiltinTag.lengthOfByteString;
        case "indexByteString":
            return UPLCBuiltinTag.indexByteString;
        case "equalsByteString":
            return UPLCBuiltinTag.equalsByteString;
        case "lessThanByteString":
            return UPLCBuiltinTag.lessThanByteString;
        case "lessThanEqualsByteString":
            return UPLCBuiltinTag.lessThanEqualsByteString;
        case "sha2_256":
            return UPLCBuiltinTag.sha2_256;
        case "sha3_256":
            return UPLCBuiltinTag.sha3_256;
        case "blake2b_256":
            return UPLCBuiltinTag.blake2b_256;
        case "verifyEd25519Signature":
            return UPLCBuiltinTag.verifyEd25519Signature;
        case "appendString":
            return UPLCBuiltinTag.appendString;
        case "equalsString":
            return UPLCBuiltinTag.equalsString;
        case "encodeUtf8":
            return UPLCBuiltinTag.encodeUtf8;
        case "decodeUtf8":
            return UPLCBuiltinTag.decodeUtf8;
        case "ifThenElse":
            return UPLCBuiltinTag.ifThenElse;
        case "chooseUnit":
            return UPLCBuiltinTag.chooseUnit;
        case "trace":
            return UPLCBuiltinTag.trace;
        case "fstPair":
            return UPLCBuiltinTag.fstPair;
        case "sndPair":
            return UPLCBuiltinTag.sndPair;
        case "chooseList":
            return UPLCBuiltinTag.chooseList;
        case "mkCons":
            return UPLCBuiltinTag.mkCons;
        case "headList":
            return UPLCBuiltinTag.headList;
        case "tailList":
            return UPLCBuiltinTag.tailList;
        case "nullList":
            return UPLCBuiltinTag.nullList;
        case "chooseData":
            return UPLCBuiltinTag.chooseData;
        case "constrData":
            return UPLCBuiltinTag.constrData;
        case "mapData":
            return UPLCBuiltinTag.mapData;
        case "listData":
            return UPLCBuiltinTag.listData;
        case "iData":
            return UPLCBuiltinTag.iData;
        case "bData":
            return UPLCBuiltinTag.bData;
        case "unConstrData":
            return UPLCBuiltinTag.unConstrData;
        case "unMapData":
            return UPLCBuiltinTag.unMapData;
        case "unListData":
            return UPLCBuiltinTag.unListData;
        case "unIData":
            return UPLCBuiltinTag.unIData;
        case "unBData":
            return UPLCBuiltinTag.unBData;
        case "equalsData":
            return UPLCBuiltinTag.equalsData;
        case "mkPairData":
            return UPLCBuiltinTag.mkPairData;
        case "mkNilData":
            return UPLCBuiltinTag.mkNilData;
        case "mkNilPairData":
            return UPLCBuiltinTag.mkNilPairData;
        case "serialiseData":
            return UPLCBuiltinTag.serialiseData;
        case "verifyEcdsaSecp256k1Signature":
            return UPLCBuiltinTag.verifyEcdsaSecp256k1Signature;
        case "verifySchnorrSecp256k1Signature":
            return UPLCBuiltinTag.verifySchnorrSecp256k1Signature;
        case "bls12_381_G1_add":
            return UPLCBuiltinTag.bls12_381_G1_add;
        case "bls12_381_G1_neg":
            return UPLCBuiltinTag.bls12_381_G1_neg;
        case "bls12_381_G1_scalarMul":
            return UPLCBuiltinTag.bls12_381_G1_scalarMul;
        case "bls12_381_G1_equal":
            return UPLCBuiltinTag.bls12_381_G1_equal;
        case "bls12_381_G1_hashToGroup":
            return UPLCBuiltinTag.bls12_381_G1_hashToGroup;
        case "bls12_381_G1_compress":
            return UPLCBuiltinTag.bls12_381_G1_compress;
        case "bls12_381_G1_uncompress":
            return UPLCBuiltinTag.bls12_381_G1_uncompress;
        case "bls12_381_G2_add":
            return UPLCBuiltinTag.bls12_381_G2_add;
        case "bls12_381_G2_neg":
            return UPLCBuiltinTag.bls12_381_G2_neg;
        case "bls12_381_G2_scalarMul":
            return UPLCBuiltinTag.bls12_381_G2_scalarMul;
        case "bls12_381_G2_equal":
            return UPLCBuiltinTag.bls12_381_G2_equal;
        case "bls12_381_G2_hashToGroup":
            return UPLCBuiltinTag.bls12_381_G2_hashToGroup;
        case "bls12_381_G2_compress":
            return UPLCBuiltinTag.bls12_381_G2_compress;
        case "bls12_381_G2_uncompress":
            return UPLCBuiltinTag.bls12_381_G2_uncompress;
        case "bls12_381_millerLoop":
            return UPLCBuiltinTag.bls12_381_millerLoop;
        case "bls12_381_mulMlResult":
            return UPLCBuiltinTag.bls12_381_mulMlResult;
        case "bls12_381_finalVerify":
            return UPLCBuiltinTag.bls12_381_finalVerify;
        case "keccak_256":
            return UPLCBuiltinTag.keccak_256;
        case "blake2b_224":
            return UPLCBuiltinTag.blake2b_224;
        case "integerToByteString":
            return UPLCBuiltinTag.integerToByteString;
        case "byteStringToInteger":
            return UPLCBuiltinTag.byteStringToInteger;
        default:
            // tag; // check that is of type 'never'
            throw new Error("unknow builtin: " + tag);
    }
}
exports.builtinTagFromString = builtinTagFromString;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/Builtin.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Builtin = void 0;
/**
 * # 5 Built in types, functions, and values
 *
 * Plutus Core comes with a predefined set of built-in types and functions which will be useful
 * for blockchain applications.
 *
 * The set of built-ins is fixed, although in future we may provide a
 * framework to allow customisation for specialised blockchains.
 *
 * There are four basic types: unit, bool, integer, and bytestring (and strings only for debugging purposes)
 *
 * These types are given in Figure 13:
 *
 * for example (con integer) is the type of signed integers.
 *
 * We provide standard arithmetic and comparison operations for integers and a number of list-like functions for bytestrings.
 *
 * The details are given in Figure 14, using a number of abbreviations given in Figure 12.
 *
 * Note the following:
 *
 *  •   Some of the entries in Figure 14 contain success conditions. If a success condition is violated
 *      then the function immediately returns (error).
 *
 *  •   Every built-in function returns either a value or the term (error).
 *
 *  •   The ifThenElse operation is polymorphic and must be instantiated with the type of its
 *      branches before being applied: see the example below.
 *
 *  •   We provide two versions of the division and remainder operations for integers. These differ
 *      in their treatment of negative arguments.
 */ var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var UPLCBuiltinTag_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/UPLCBuiltinTag.js [app-client] (ecmascript)");
var assert_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)");
var Builtin = function() {
    function Builtin(tag) {
        (0, assert_1.assert)((0, UPLCBuiltinTag_1.isUPLCBuiltinTag)(tag), "cannot instatinitate a 'Builtin' using tag: " + tag.toString());
        this._tag = tag;
    }
    Object.defineProperty(Builtin, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("0111");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin.prototype, "tag", {
        get: function() {
            return this._tag;
        },
        enumerable: false,
        configurable: true
    });
    Builtin.prototype.clone = function() {
        return new Builtin(this.tag);
    };
    Object.defineProperty(Builtin, "addInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.addInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "subtractInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.subtractInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "multiplyInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.multiplyInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "divideInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.divideInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "quotientInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.quotientInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "remainderInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.remainderInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "modInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.modInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "equalsInteger", {
        // integers comparison operaitons
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.equalsInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "lessThanInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.lessThanInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "lessThanEqualInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.lessThanEqualInteger);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "appendByteString", {
        // bytestring operations
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.appendByteString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "consByteString", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.consByteString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "sliceByteString", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.sliceByteString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "lengthOfByteString", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.lengthOfByteString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "indexByteString", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.indexByteString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "equalsByteString", {
        // bytestring comparison operations
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.equalsByteString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "lessThanByteString", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.lessThanByteString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "lessThanEqualsByteString", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.lessThanEqualsByteString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "sha2_256", {
        // hashes
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.sha2_256);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "sha3_256", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.sha3_256);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "blake2b_256", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.blake2b_256);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "verifyEd25519Signature", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.verifyEd25519Signature);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "appendString", {
        // string operations
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.appendString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "equalsString", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.equalsString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "encodeUtf8", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.encodeUtf8);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "decodeUtf8", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.decodeUtf8);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "ifThenElse", {
        // control flow
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.ifThenElse);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "chooseUnit", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.chooseUnit);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "trace", {
        // tracing
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.trace);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "fstPair", {
        // data
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.fstPair);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "sndPair", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.sndPair);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "chooseList", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.chooseList);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "mkCons", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.mkCons);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "headList", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.headList);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "tailList", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.tailList);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "nullList", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.nullList);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "chooseData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.chooseData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "constrData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.constrData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "mapData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.mapData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "listData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.listData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "iData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.iData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "unConstrData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.unConstrData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "unMapData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.unMapData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "unListData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.unListData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "unIData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.unIData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "unBData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.unBData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "equalsData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.equalsData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "mkPairData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.mkPairData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "mkNilData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.mkNilData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "mkNilPairData", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.mkNilPairData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "serialiseData", {
        // Vasil (Plutus V2: Builtin)
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.serialiseData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "verifyEcdsaSecp256k1Signature", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.verifyEcdsaSecp256k1Signature);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "verifySchnorrSecp256k1Signature", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.verifySchnorrSecp256k1Signature);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G1_add", {
        // PlutusV3
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G1_add);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G1_neg", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G1_neg);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G1_scalarMul", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G1_scalarMul);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G1_equal", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G1_equal);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G1_hashToGroup", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G1_hashToGroup);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G1_compress", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G1_compress);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G1_uncompress", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G1_uncompress);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G2_add", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G2_add);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G2_neg", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G2_neg);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G2_scalarMul", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G2_scalarMul);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G2_equal", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G2_equal);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G2_hashToGroup", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G2_hashToGroup);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G2_compress", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G2_compress);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_G2_uncompress", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_G2_uncompress);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_millerLoop", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_millerLoop);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_mulMlResult", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_mulMlResult);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "bls12_381_finalVerify", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.bls12_381_finalVerify);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "keccak_256", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.keccak_256);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "blake2b_224", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.blake2b_224);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "integerToByteString", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.integerToByteString);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builtin, "byteStringToInteger", {
        get: function() {
            return new Builtin(UPLCBuiltinTag_1.UPLCBuiltinTag.byteStringToInteger);
        },
        enumerable: false,
        configurable: true
    });
    return Builtin;
}();
exports.Builtin = Builtin;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstType/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.constPairTypeUtils = exports.constListTypeUtils = exports.constTypeToStirng = exports.constTypeTagToStirng = exports.isConstTypeTag = exports.constT = exports.constTypeEq = exports.isWellFormedConstType = exports.ConstTyTag = void 0;
var assert_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)");
var ConstTyTag;
(function(ConstTyTag) {
    ConstTyTag[ConstTyTag["int"] = 0] = "int";
    ConstTyTag[ConstTyTag["byteStr"] = 1] = "byteStr";
    ConstTyTag[ConstTyTag["str"] = 2] = "str";
    ConstTyTag[ConstTyTag["unit"] = 3] = "unit";
    ConstTyTag[ConstTyTag["bool"] = 4] = "bool";
    ConstTyTag[ConstTyTag["list"] = 5] = "list";
    ConstTyTag[ConstTyTag["pair"] = 6] = "pair";
    // tyApp = 7, // only used internally for types like list and pair
    ConstTyTag[ConstTyTag["data"] = 8] = "data";
    /** NEVER ENCODED; still needed for plutus-machine values */ ConstTyTag[ConstTyTag["bls12_381_G1_element"] = 9] = "bls12_381_G1_element";
    ConstTyTag[ConstTyTag["bls12_381_G2_element"] = 10] = "bls12_381_G2_element";
    ConstTyTag[ConstTyTag["bls12_381_MlResult"] = 11] = "bls12_381_MlResult";
})(ConstTyTag = exports.ConstTyTag || (exports.ConstTyTag = {}));
function isWellFormedConstType(type /*ConstType | ConstTyTag[]*/ ) {
    if (!Array.isArray(type)) return false;
    if (type.length === 0) return false;
    if (!type.every(isConstTypeTag)) return false;
    if (type[0] !== ConstTyTag.list && type[0] !== ConstTyTag.pair) return type.length === 1;
    // keeps track of the missing terms to provide as argument
    // well formed types from this point must start with either 'ConstTyTag.list' of 'ConstTyTag.pair'
    // in any case the stack must count that tag as top level
    var stack = [
        1
    ];
    if (type[0] !== ConstTyTag.list && type[0] !== ConstTyTag.pair) {
        // returning false anyway, type has too many arguments, not well-formed
        return false;
    }
    function topStackMinusOne() {
        (0, assert_1.assert)(stack.length > 0, new Error("while calling 'topStackMinusOne' in 'ConstEmptyList._isWellFormedListType'; stack was empty"));
        var missingTyArgsToProvide = stack[stack.length - 1] - 1;
        if (missingTyArgsToProvide < 0) {
            throw new Error("while checking for type correctness in empty constant list; stack element was less than 0");
        }
        stack[stack.length - 1] = missingTyArgsToProvide;
    }
    for(var i = 0; i < type.length; i++){
        var ty = type[i];
        if (ty === ConstTyTag.list) {
            if (!(i + 1 < type.length)) return false;
            topStackMinusOne();
            stack.push(1); // add new layer
        } else if (ty === ConstTyTag.pair) {
            if (!(i + 2 < type.length)) return false;
            topStackMinusOne();
            stack.push(2); // add new layer for pair
        } else {
            topStackMinusOne(); // got an argument
        }
        // clear fulfilled layers
        while(stack.length > 0 && stack[stack.length - 1] === 0){
            stack.pop(); // clear layer
        }
        if (stack.length === 0 && // stack is empty
        i !== type.length - 1 // and we are not at the end of the type
        ) {
            return false; // addtional types provided
        }
        if (i === type.length - 1 && // we are at the end of the type
        stack.length !== 0 // and the stack expects some more arguments
        ) {
            return false; // missing some arguments
        }
    }
    return true;
}
exports.isWellFormedConstType = isWellFormedConstType;
/**
 * **does NOT require the types to be well-formed**
 *
 * merly checks to have the same tags at the same place
 */ function constTypeEq(a, b) {
    if (a.length !== b.length) return false;
    return a.every(function(tyTag, i) {
        return tyTag === b[i];
    });
}
exports.constTypeEq = constTypeEq;
/**
 * well formed types
 */ exports.constT = Object.freeze({
    int: Object.freeze([
        ConstTyTag.int
    ]),
    byteStr: Object.freeze([
        ConstTyTag.byteStr
    ]),
    str: Object.freeze([
        ConstTyTag.str
    ]),
    unit: Object.freeze([
        ConstTyTag.unit
    ]),
    bool: Object.freeze([
        ConstTyTag.bool
    ]),
    listOf: function(tyArg) {
        (0, assert_1.assert)(isWellFormedConstType(tyArg), "provided argument to 'constT.listOf' should be a well formed type, try using types exposed by  the 'constT' object itself");
        return Object.freeze(__spreadArray([
            ConstTyTag.list
        ], __read(tyArg), false));
    },
    pairOf: function(tyArg1, tyArg2) {
        (0, assert_1.assert)(isWellFormedConstType(tyArg1) && isWellFormedConstType(tyArg2), "provided argument to 'constT.pairOf' should be a well formed type, try using types exposed by  the 'constT' object itself");
        return Object.freeze(__spreadArray(__spreadArray([
            ConstTyTag.pair
        ], __read(tyArg1), false), __read(tyArg2), false));
    },
    data: Object.freeze([
        ConstTyTag.data
    ]),
    bls12_381_G1_element: Object.freeze([
        ConstTyTag.bls12_381_G1_element
    ]),
    bls12_381_G2_element: Object.freeze([
        ConstTyTag.bls12_381_G2_element
    ]),
    bls12_381_MlResult: Object.freeze([
        ConstTyTag.bls12_381_MlResult
    ])
});
function isConstTypeTag(constTy) {
    constTy = constTy;
    return constTy === ConstTyTag.int || constTy === ConstTyTag.byteStr || constTy === ConstTyTag.str || constTy === ConstTyTag.unit || constTy === ConstTyTag.bool || constTy === ConstTyTag.list || constTy === ConstTyTag.pair || // (constTyTag as number) === 7   || // uncomment if tyApp should be considered
    constTy === ConstTyTag.data || constTy === ConstTyTag.bls12_381_G1_element || constTy === ConstTyTag.bls12_381_G2_element || constTy === ConstTyTag.bls12_381_MlResult;
}
exports.isConstTypeTag = isConstTypeTag;
function constTypeTagToStirng(ty) {
    switch(ty){
        case ConstTyTag.int:
            return "integer";
        case ConstTyTag.byteStr:
            return "bytestring";
        case ConstTyTag.str:
            return "string";
        case ConstTyTag.unit:
            return "unit";
        case ConstTyTag.bool:
            return "boolean";
        case ConstTyTag.list:
            return "list";
        case ConstTyTag.pair:
            return "pair";
        case ConstTyTag.data:
            return "data";
        case ConstTyTag.bls12_381_G1_element:
            return "bls12_381_G1_element";
        case ConstTyTag.bls12_381_G2_element:
            return "bls12_381_G2_element";
        case ConstTyTag.bls12_381_MlResult:
            return "bls12_381_MlResult";
        default:
            throw new Error("'constTypeTAgToStirng' is supposed to have a member of the 'ConstTy' enum as input but got: " + ty);
    }
}
exports.constTypeTagToStirng = constTypeTagToStirng;
function constTypeToStirng(ty) {
    return ty.map(constTypeTagToStirng).join(' ');
}
exports.constTypeToStirng = constTypeToStirng;
// -------------------------------------------------- ConstListType Utils -------------------------------------------------- //
function getConstListTypeArgument(listTy) {
    (0, assert_1.assert)(listTy.length > 0 && listTy[0] === ConstTyTag.list && isWellFormedConstType(listTy), "in 'constListTypeUtils.getTypeArgument', input type was not a valid list type");
    return listTy.slice(1);
}
;
function getNonWellFormedConstListTypeArgument(listTy) {
    (0, assert_1.assert)(listTy.length > 0 && listTy[0] === ConstTyTag.list, "in 'constListTypeUtils.getTypeArgument', input type was not a valid list type");
    var rawArg = listTy.slice(1);
    if (rawArg.length === 0) return undefined;
    if (isWellFormedConstType(rawArg)) return rawArg;
    if (rawArg[0] !== ConstTyTag.list && rawArg[0] !== ConstTyTag.pair) {
        return [
            rawArg[0]
        ];
    }
    if (rawArg[0] === ConstTyTag.list) {
        var tyArgOfList = getNonWellFormedConstListTypeArgument(rawArg);
        if (tyArgOfList === undefined) return undefined;
        return __spreadArray([
            ConstTyTag.list
        ], __read(tyArgOfList), false);
    }
    if (rawArg[0] === ConstTyTag.pair) {
        var firstArg = getNonWellFormedConstPairFirstTypeArgument(rawArg);
        if (firstArg === undefined) {
            return undefined;
        }
        var secondArg = getNonWellFormedConstPairSecondTypeArgument(rawArg);
        if (secondArg === undefined) {
            return undefined;
        }
        return exports.constT.pairOf(firstArg, secondArg);
    }
}
exports.constListTypeUtils = Object.freeze({
    getTypeArgument: getConstListTypeArgument,
    nonWellFormed: Object.freeze({
        /**
         *
         * @param listTy
         * @returns
         *      ```undefined``` only if the type argument was not complete
         *      returns the sliced type argument if too many where provided
         *      same of ```constListTypeUtils.getTypeArgument``` if the type argument was well formed
         */ getNonWellFormedTypeArgument: getNonWellFormedConstListTypeArgument
    })
});
// -------------------------------------------------- ConstPairType Utils -------------------------------------------------- //
function getConstPairFirstTypeArgument(pairTy) {
    (0, assert_1.assert)(pairTy.length > 0 && pairTy[0] === ConstTyTag.pair && isWellFormedConstType(pairTy), "in 'constPairTypeUtils.getFirstTypeArgument', input type was not a valid pair type");
    var rawArg = pairTy.slice(1);
    if (rawArg.length === 0) {
        throw new Error("'pairTy' was supposed to be well formed but is missing arguments for 'ConstTyTag.pair'");
    }
    if (rawArg[0] !== ConstTyTag.list && rawArg[0] !== ConstTyTag.pair) {
        // argument takes no more arguments
        return [
            pairTy[1]
        ];
    }
    if (rawArg[0] === ConstTyTag.list) {
        // non well formed in order to ignore the second argument
        var listTyArg = getNonWellFormedConstListTypeArgument(rawArg);
        if (listTyArg === undefined) {
            throw new Error("in 'getConstPairFirstTypeArgument' (exported as 'constPairTypeUtils.getFirstTypeArgument'); " + "'listTyArg' was expected to be a well formed type but was missing some arguments to be well formed; " + "this case sould have trown while checking for the 'pairTy' to be well formed");
        }
        return __spreadArray([
            ConstTyTag.list
        ], __read(listTyArg), false);
    }
    if (rawArg[0] === ConstTyTag.pair) {
        var firstArg = getNonWellFormedConstPairFirstTypeArgument(rawArg);
        if (firstArg === undefined) {
            throw new Error("in 'getConstPairFirstTypeArgument'; " + "'firstArg' was expected to be a well formed type but was missing some arguments to be well formed; " + "this case sould have trown while checking for the 'pairTy' to be well formed");
        }
        var secondArg = getNonWellFormedConstPairSecondTypeArgument(rawArg);
        if (secondArg === undefined) {
            throw new Error("in 'getConstPairFirstTypeArgument'; " + "'secondArg' was expected to be a well formed type but was missing some arguments to be well formed; " + "this case sould have trown while checking for the 'pairTy' to be well formed");
        }
        return exports.constT.pairOf(firstArg, secondArg);
    }
    throw new Error("unexpected execution flow; 'getConstPairFirstTypeArgument' did not match any `ConstTyTag` as first argument");
}
function getConstPairSecondTypeArgument(pairTy) {
    /*
    assert(
        pairTy.length > 0 && pairTy[0] === ConstTyTag.pair && isWellFormedConstType( pairTy ),
        "in 'constPairTypeUtils.getFirstTypeArgument', input type was not a valid pair type"
    );*/ // made in the 'getConstPairFirstTypeArgument'call
    // if pairTy is not well formed throws
    // if doesn't throw is well formed
    // if it is well formed the sliced part is the well formed type
    return pairTy.slice(1 + getConstPairFirstTypeArgument(pairTy).length);
}
function getNonWellFormedConstPairFirstTypeArgument(pairTy) {
    (0, assert_1.assert)(pairTy.length > 0 && pairTy[0] === ConstTyTag.pair, "in 'constPairTypeUtils.getFirstTypeArgument', input type was not a valid pair type");
    var rawArg = pairTy.slice(1);
    // at least two tags mus follow in order to be fulfilled
    if (rawArg.length < 2) {
        return undefined;
    }
    if (rawArg[0] !== ConstTyTag.list && rawArg[0] !== ConstTyTag.pair) {
        // argument takes no more arguments
        return [
            pairTy[1]
        ];
    }
    if (rawArg[0] === ConstTyTag.list) {
        // non well formed in order to ignore the second argument
        var listTyArg = getNonWellFormedConstListTypeArgument(rawArg);
        if (listTyArg === undefined) return undefined;
        return __spreadArray([
            ConstTyTag.list
        ], __read(listTyArg), false);
    }
    if (rawArg[0] === ConstTyTag.pair) {
        var firstArg = getNonWellFormedConstPairFirstTypeArgument(rawArg);
        if (firstArg === undefined) {
            return undefined;
        }
        var secondArg = getNonWellFormedConstPairSecondTypeArgument(rawArg);
        if (secondArg === undefined) {
            return undefined;
        }
        return exports.constT.pairOf(firstArg, secondArg);
    }
    throw new Error("unexpected execution flow; 'getNonWellFormedConstPairFirstTypeArgument' did not match any `ConstTyTag` as first argument");
}
function getNonWellFormedConstPairSecondTypeArgument(pairTy) {
    /*
    assert(
        pairTy.length > 0 && pairTy[0] === ConstTyTag.pair,
        "in 'constPairTypeUtils.getFirstTypeArgument', input type was not a valid pair type"
    );
    */ // made in the 'getNonWellFormedConstPairFirstTypeArgument' call
    var pairFirstTyArg = getNonWellFormedConstPairFirstTypeArgument(pairTy);
    if (pairFirstTyArg === undefined) return undefined;
    var rawSecondArg = pairTy.slice(1 + pairFirstTyArg.length);
    if (rawSecondArg.length === 0) return undefined;
    if (rawSecondArg[0] !== ConstTyTag.list && rawSecondArg[0] !== ConstTyTag.pair) {
        // argument takes no more arguments
        return [
            rawSecondArg[0]
        ];
    }
    if (rawSecondArg[0] === ConstTyTag.list) {
        // non well formed in order to ignore the second argument
        var listTyArg = getNonWellFormedConstListTypeArgument(rawSecondArg);
        if (listTyArg === undefined) return undefined;
        return __spreadArray([
            ConstTyTag.list
        ], __read(listTyArg), false);
    }
    if (rawSecondArg[0] === ConstTyTag.pair) {
        var firstArg = getNonWellFormedConstPairFirstTypeArgument(rawSecondArg);
        if (firstArg === undefined) {
            return undefined;
        }
        var secondArg = getNonWellFormedConstPairSecondTypeArgument(rawSecondArg);
        if (secondArg === undefined) {
            return undefined;
        }
        return exports.constT.pairOf(firstArg, secondArg);
    }
    throw new Error("unexpected execution flow; 'getNonWellFormedConstPairFirstTypeArgument' did not match any `ConstTyTag` as first argument");
}
exports.constPairTypeUtils = Object.freeze({
    getFirstTypeArgument: getConstPairFirstTypeArgument,
    getSecondTypeArgument: getConstPairSecondTypeArgument,
    nonWellFormed: Object.freeze({
        /**
         *
         * @param listTy
         * @returns
         *      ```undefined``` only if the type argument was not complete
         *      returns the sliced type argument if too many where provided
         *      same of ```constPairTypeUtils.getFirstTypeArgument``` if the type argument was well formed
         */ getFirstTypeArgument: getNonWellFormedConstPairFirstTypeArgument,
        /**
         *
         * @param listTy
         * @returns
         *      ```undefined``` only if the type argument was not complete
         *      returns the sliced type argument if too many where provided
         *      same of ```constPairTypeUtils.getSecondTypeArgument``` if the type argument was well formed
         */ getSecondTypeArgument: getNonWellFormedConstPairSecondTypeArgument
    })
});
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstValue/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isConstValueList = exports.canConstValueBeOfConstType = exports.inferConstTypeFromConstValueOrDefault = exports.inferConstTypeFromConstValue = exports.eqConstValue = exports.isConstValue = exports.isConstValueInt = void 0;
var bytestring_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bytestring@1.0.0/node_modules/@harmoniclabs/bytestring/dist/index.js [app-client] (ecmascript)");
var pair_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+pair@1.0.0/node_modules/@harmoniclabs/pair/dist/index.js [app-client] (ecmascript)");
var plutus_data_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+plutus-data@1.2.4/node_modules/@harmoniclabs/plutus-data/dist/index.js [app-client] (ecmascript)");
var ConstType_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstType/index.js [app-client] (ecmascript)");
var uint8array_utils_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uint8array-utils@1.0.4/node_modules/@harmoniclabs/uint8array-utils/dist/index.js [app-client] (ecmascript)");
var assert_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)");
var crypto_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+crypto@0.2.5/node_modules/@harmoniclabs/crypto/dist/index.js [app-client] (ecmascript)");
function isConstValueInt(n) {
    return typeof n === "bigint" || typeof n === "number" && Number.isSafeInteger(n);
}
exports.isConstValueInt = isConstValueInt;
function isConstValue(value) {
    return value === undefined || isConstValueInt(value) || value instanceof bytestring_1.ByteString && bytestring_1.ByteString.isStrictInstance(value) || typeof value === "string" || typeof value === "boolean" || isConstValueList(value) || pair_1.Pair.isStrictInstance(value) && isConstValue(value.fst) && isConstValue(value.snd) || (0, plutus_data_1.isData)(value) || (0, crypto_1.isBlsG1)(value) || (0, crypto_1.isBlsG2)(value) || (0, crypto_1.isBlsResult)(value);
}
exports.isConstValue = isConstValue;
function eqConstValue(a, b) {
    if (a === undefined) return b === undefined;
    if (!(isConstValue(a) || isConstValue(b))) return false;
    if (typeof a === "number" || typeof a == "bigint") return (typeof b === "number" || typeof b == "bigint") && BigInt(a) === BigInt(b);
    if (a instanceof bytestring_1.ByteString) return b instanceof bytestring_1.ByteString && (0, uint8array_utils_1.uint8ArrayEq)(a.toBuffer(), b.toBuffer());
    if (typeof a === "string") return typeof b === "string" && a === b;
    if (typeof a === "boolean") return typeof b === "boolean" && a === b;
    if ((0, crypto_1.isBlsG1)(a)) return (0, crypto_1.isBlsG1)(b) && (0, crypto_1.bls12_381_G1_equal)(a, b);
    if ((0, crypto_1.isBlsG2)(a)) return (0, crypto_1.isBlsG2)(b) && (0, crypto_1.bls12_381_G2_equal)(a, b);
    if ((0, crypto_1.isBlsResult)(a)) return (0, crypto_1.isBlsResult)(b) && (0, crypto_1.bls12_381_eqMlResult)(a, b);
    if ((0, plutus_data_1.isData)(a)) return (0, plutus_data_1.isData)(b) && (0, plutus_data_1.eqData)(a, b);
    if (a instanceof pair_1.Pair) return b instanceof pair_1.Pair && eqConstValue(a.fst, b.fst) && eqConstValue(a.snd, b.snd);
    if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every(function(v, i) {
        return eqConstValue(v, b[i]);
    });
    return false;
}
exports.eqConstValue = eqConstValue;
// mutually recursive on arrays (list values)
// inferConstTypeFromConstValue -> isConstValue -> isConstValueList (on list element) -> inferConstTypeFromConstValue
/**
 *
 * @param val
 * @returns the type of the ```ConstValue``` input ```undefined``` if it is not possible to infer the type ( eg. [] :: list ? )
 */ function inferConstTypeFromConstValue(val) {
    (0, assert_1.assert)(isConstValue(val), "'inferConstTypeFromConstValue' expects a valid 'ConstValue' type, input was: " + val);
    if (val === undefined) return ConstType_1.constT.unit;
    if (isConstValueInt(val)) return ConstType_1.constT.int;
    if (val instanceof bytestring_1.ByteString && bytestring_1.ByteString.isStrictInstance(val)) return ConstType_1.constT.byteStr;
    if (typeof val === "string") return ConstType_1.constT.str;
    if (typeof val === "boolean") return ConstType_1.constT.bool;
    if ((0, crypto_1.isBlsG1)(val)) return ConstType_1.constT.bls12_381_G1_element;
    if ((0, crypto_1.isBlsG2)(val)) return ConstType_1.constT.bls12_381_G2_element;
    if ((0, crypto_1.isBlsResult)(val)) return ConstType_1.constT.bls12_381_MlResult;
    if (Array.isArray(val)) {
        if (val.length === 0) return undefined;
        var firstElemTy_1 = undefined;
        for(var i = 0; i < val.length && firstElemTy_1 === undefined; i++){
            firstElemTy_1 = inferConstTypeFromConstValue(val[i]);
        }
        if (firstElemTy_1 === undefined) return undefined;
        (0, assert_1.assert)(val.every(function(listElem) {
            return canConstValueBeOfConstType(listElem, firstElemTy_1);
        }), "'inferConstTypeFromConstValue': incongruent elements of constant list");
        return ConstType_1.constT.listOf(firstElemTy_1);
    }
    if (val instanceof pair_1.Pair && pair_1.Pair.isStrictInstance(val)) {
        var fstTy = inferConstTypeFromConstValue(val.fst);
        if (fstTy === undefined) return undefined;
        var sndTy = inferConstTypeFromConstValue(val.snd);
        if (sndTy === undefined) return undefined;
        return ConstType_1.constT.pairOf(fstTy, sndTy);
    }
    if ((0, plutus_data_1.isData)(val)) return ConstType_1.constT.data;
    throw new Error("'inferConstTypeFromConstValue' did not match any possible value");
}
exports.inferConstTypeFromConstValue = inferConstTypeFromConstValue;
/**
 * same as ```inferConstTypeFromConstValue``` but with a default Type if it is not possible to infer
 */ function inferConstTypeFromConstValueOrDefault(value, defaultTy) {
    var _a;
    var inferredTy = inferConstTypeFromConstValue(value);
    if (inferredTy !== undefined) {
        return inferredTy;
    }
    // it was not possible to infer the value;
    // assert the provided default can actually have values
    (0, assert_1.assert)((0, ConstType_1.isWellFormedConstType)(defaultTy), "the provided 'defaultTy' is not a well formed constant type; try using the exported 'constT' object to be sure it is well formed");
    // assert the default type is ok for the provided value
    (0, assert_1.assert)(canConstValueBeOfConstType(value, defaultTy), "the provided default ConstType is not adeguate for the provided ConstValue, given inputs: [ " + ((_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : "undefined") + " , " + (0, ConstType_1.constTypeToStirng)(defaultTy) + " ]");
    return defaultTy;
}
exports.inferConstTypeFromConstValueOrDefault = inferConstTypeFromConstValueOrDefault;
function canConstValueBeOfConstType(val, ty) {
    if (!(0, ConstType_1.isWellFormedConstType)(ty)) return false;
    if ((0, ConstType_1.constTypeEq)(ty, ConstType_1.constT.unit)) return val === undefined;
    if ((0, ConstType_1.constTypeEq)(ty, ConstType_1.constT.bool)) return typeof val === "boolean";
    if ((0, ConstType_1.constTypeEq)(ty, ConstType_1.constT.byteStr)) return val instanceof bytestring_1.ByteString && bytestring_1.ByteString.isStrictInstance(val);
    if ((0, ConstType_1.constTypeEq)(ty, ConstType_1.constT.data)) return val === undefined ? false : (0, plutus_data_1.isData)(val);
    if ((0, ConstType_1.constTypeEq)(ty, ConstType_1.constT.int)) return isConstValueInt(val);
    if ((0, ConstType_1.constTypeEq)(ty, ConstType_1.constT.str)) return typeof val === "string";
    if ((0, ConstType_1.constTypeEq)(ty, ConstType_1.constT.bls12_381_G1_element)) return (0, crypto_1.isBlsG1)(val);
    if ((0, ConstType_1.constTypeEq)(ty, ConstType_1.constT.bls12_381_G2_element)) return (0, crypto_1.isBlsG2)(val);
    if ((0, ConstType_1.constTypeEq)(ty, ConstType_1.constT.bls12_381_MlResult)) return (0, crypto_1.isBlsResult)(val);
    if (ty[0] === ConstType_1.ConstTyTag.list) return Array.isArray(val) && val.every(function(valueElement) {
        return canConstValueBeOfConstType(valueElement, ConstType_1.constListTypeUtils.getTypeArgument(ty));
    });
    if (ty[0] === ConstType_1.ConstTyTag.pair) return val instanceof pair_1.Pair && pair_1.Pair.isStrictInstance(val) && canConstValueBeOfConstType(val.fst, ConstType_1.constPairTypeUtils.getFirstTypeArgument(ty)) && canConstValueBeOfConstType(val.snd, ConstType_1.constPairTypeUtils.getSecondTypeArgument(ty));
    throw new Error("'canConstValueBeOfConstType' did not match any type tag");
}
exports.canConstValueBeOfConstType = canConstValueBeOfConstType;
function isConstValueList(val) {
    if (!Array.isArray(val)) return false;
    // [] is a valid value for any list type
    if (val.length === 0) return true;
    var firstElemTy = undefined;
    for(var i = 0; i < val.length && firstElemTy === undefined; i++){
        firstElemTy = inferConstTypeFromConstValue(val[i]);
    }
    function isArrayOfEmptyArray(arr) {
        if (!Array.isArray(arr)) return false;
        return arr.every(function(elem) {
            return Array.isArray(elem) && elem.length === 0 || isArrayOfEmptyArray(elem);
        });
    }
    if (firstElemTy === undefined) {
        return isArrayOfEmptyArray(val);
    }
    return val.every(function(listElem) {
        return canConstValueBeOfConstType(listElem, firstElemTy);
    });
}
exports.isConstValueList = isConstValueList;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/UPLCConst.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UPLCConst = void 0;
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var pair_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+pair@1.0.0/node_modules/@harmoniclabs/pair/dist/index.js [app-client] (ecmascript)");
var ConstType_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstType/index.js [app-client] (ecmascript)");
var ConstValue_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstValue/index.js [app-client] (ecmascript)");
var assert_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)");
var UPLCConst = function() {
    function UPLCConst(typeTag, value) {
        (0, assert_1.assert)((0, ConstType_1.isWellFormedConstType)(typeTag), "trying to construct an UPLC constant with an invalid type; input type: " + (0, ConstType_1.constTypeToStirng)(typeTag));
        (0, assert_1.assert)((0, ConstValue_1.canConstValueBeOfConstType)(value, typeTag), "trying to construct an UPLC constant with an invalid value for type \"".concat((0, ConstType_1.constTypeToStirng)(typeTag), "\";\n             input value was: ").concat(value));
        if ((0, ConstType_1.constTypeEq)(typeTag, ConstType_1.constT.int)) value = BigInt(value);
        if ((0, ConstType_1.constTypeEq)(typeTag, ConstType_1.constT.listOf(ConstType_1.constT.int))) value = value.map(function(n) {
            return BigInt(n);
        });
        if (typeTag[0] === ConstType_1.ConstTyTag.pair) {
            if ((0, ConstType_1.constTypeEq)(ConstType_1.constPairTypeUtils.getFirstTypeArgument(typeTag), ConstType_1.constT.int)) value.fst = BigInt(value.fst);
            if ((0, ConstType_1.constTypeEq)(ConstType_1.constPairTypeUtils.getSecondTypeArgument(typeTag), ConstType_1.constT.int)) value.snd = BigInt(value.snd);
        }
        this._type = typeTag;
        this._value = value;
    }
    Object.defineProperty(UPLCConst, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("0100");
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(UPLCConst.prototype, "type", {
        get: function() {
            // clone
            return this._type.map(function(tag) {
                return tag;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UPLCConst.prototype, "value", {
        get: function() {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    UPLCConst.prototype.clone = function() {
        return new UPLCConst(this.type, this.value);
    };
    UPLCConst.int = function(int) {
        int = BigInt(int);
        return new UPLCConst(ConstType_1.constT.int, int);
    };
    UPLCConst.byteString = function(bs) {
        return new UPLCConst(ConstType_1.constT.byteStr, bs);
    };
    UPLCConst.str = function(str) {
        return new UPLCConst(ConstType_1.constT.str, str);
    };
    Object.defineProperty(UPLCConst, "unit", {
        get: function() {
            return new UPLCConst(ConstType_1.constT.unit, undefined);
        },
        enumerable: false,
        configurable: true
    });
    UPLCConst.bool = function(bool) {
        return new UPLCConst(ConstType_1.constT.bool, bool);
    };
    UPLCConst.listOf = function(typeArg) {
        return function(values) {
            return new UPLCConst(ConstType_1.constT.listOf(typeArg), values);
        };
    };
    UPLCConst.pairOf = function(typeArgFirst, typeArgSecond) {
        return function(first, second) {
            return new UPLCConst(ConstType_1.constT.pairOf(typeArgFirst, typeArgSecond), new pair_1.Pair(first, second));
        };
    };
    UPLCConst.data = function(data) {
        return new UPLCConst(ConstType_1.constT.data, data);
    };
    UPLCConst.bls12_381_G1_element = function(g1) {
        return new UPLCConst(ConstType_1.constT.bls12_381_G1_element, g1);
    };
    UPLCConst.bls12_381_G2_element = function(g2) {
        return new UPLCConst(ConstType_1.constT.bls12_381_G2_element, g2);
    };
    UPLCConst.bls12_381_MlResult = function(mlResult) {
        return new UPLCConst(ConstType_1.constT.bls12_381_MlResult, mlResult);
    };
    return UPLCConst;
}();
exports.UPLCConst = UPLCConst;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/ErrorUPLC.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ErrorUPLC = void 0;
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var ErrorUPLC = function() {
    function ErrorUPLC(msg, addInfos) {
        this.msg = msg;
        this.addInfos = addInfos;
    }
    Object.defineProperty(ErrorUPLC, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("0110");
        },
        enumerable: false,
        configurable: true
    });
    ;
    ErrorUPLC.prototype.clone = function() {
        return new ErrorUPLC(this.msg, this.addInfos);
    };
    return ErrorUPLC;
}();
exports.ErrorUPLC = ErrorUPLC;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Force.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isUPLCForce = exports.Force = exports.isForceableTerm = void 0;
var UPLCTerm_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/UPLCTerm.js [app-client] (ecmascript)");
var Delay_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Delay.js [app-client] (ecmascript)");
var UPLCVar_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCVar/index.js [app-client] (ecmascript)");
var Lambda_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Lambda.js [app-client] (ecmascript)");
var Application_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Application.js [app-client] (ecmascript)");
var UPLCConst_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/UPLCConst.js [app-client] (ecmascript)");
var ErrorUPLC_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/ErrorUPLC.js [app-client] (ecmascript)");
var Builtin_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/Builtin.js [app-client] (ecmascript)");
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
function isForceableTerm(term) {
    if (!(0, UPLCTerm_1.isUPLCTerm)(term)) return false;
    if (term instanceof UPLCVar_1.UPLCVar) return true;
    if (term instanceof Delay_1.Delay) return true;
    if (term instanceof Lambda_1.Lambda) return false;
    // needs evaluation
    if (term instanceof Application_1.Application) return true;
    if (term instanceof UPLCConst_1.UPLCConst) return false;
    // needs evaluation
    if (term instanceof Force) return true;
    if (term instanceof ErrorUPLC_1.ErrorUPLC) return false;
    // builtins that do require forces are handled in UPLC compilation
    // applied builtins are handled in the Applicaiton case
    if (term instanceof Builtin_1.Builtin) return false;
    return false;
}
exports.isForceableTerm = isForceableTerm;
var Force = function() {
    function Force(term) {
        //JsRuntime.assert(
        //    isForceableTerm( term ),
        //    "while constructing 'Force'; UPLCTerm is not Forceable"
        //);
        this.termToForce = term;
    }
    Object.defineProperty(Force, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("0101");
        },
        enumerable: false,
        configurable: true
    });
    Force.prototype.clone = function() {
        return new Force(this.termToForce.clone());
    };
    return Force;
}();
exports.Force = Force;
function isUPLCForce(any) {
    return Object.getPrototypeOf(any) === Force.prototype;
}
exports.isUPLCForce = isUPLCForce;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Application.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = exports.isUPLCApplicationBody = void 0;
var UPLCVar_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCVar/index.js [app-client] (ecmascript)");
var Lambda_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Lambda.js [app-client] (ecmascript)");
var Builtin_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/Builtin.js [app-client] (ecmascript)");
var Force_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Force.js [app-client] (ecmascript)");
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
function isUPLCApplicationBody(uplc) {
    var proto = Object.getPrototypeOf(uplc);
    // only strict instances
    return proto === UPLCVar_1.UPLCVar.prototype || proto === Lambda_1.Lambda.prototype || proto === Application.prototype || proto === Force_1.Force.prototype || proto === Builtin_1.Builtin.prototype;
}
exports.isUPLCApplicationBody = isUPLCApplicationBody;
var Application = function() {
    function Application(func, arg) {
        this.funcTerm = func;
        this.argTerm = arg;
    }
    Object.defineProperty(Application, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("0011");
        },
        enumerable: false,
        configurable: true
    });
    Application.prototype.clone = function() {
        return new Application(this.funcTerm.clone(), this.argTerm.clone());
    };
    return Application;
}();
exports.Application = Application;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Constr.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Constr = void 0;
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var Constr = function() {
    function Constr(index, terms) {
        this.index = BigInt(index);
        this.terms = terms;
    }
    Object.defineProperty(Constr, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("1000");
        },
        enumerable: false,
        configurable: true
    });
    Constr.prototype.clone = function() {
        return new Constr(this.index, this.terms.map(function(term) {
            return term.clone();
        }));
    };
    return Constr;
}();
exports.Constr = Constr;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Case.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Case = void 0;
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var Case = function() {
    function Case(constrTerm, continuations) {
        this.constrTerm = constrTerm;
        this.continuations = continuations;
    }
    Object.defineProperty(Case, "UPLCTag", {
        get: function() {
            return bitstream_1.BitStream.fromBinStr("1001");
        },
        enumerable: false,
        configurable: true
    });
    Case.prototype.clone = function() {
        return new Case(this.constrTerm.clone(), this.continuations.map(function(term) {
            return term.clone();
        }));
    };
    return Case;
}();
exports.Case = Case;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/UPLCTerm.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eqUPLCTerm = exports.getUPLCVarRefsInTerm = exports.hasMultipleRefsInTerm = exports.hasAnyRefsInTerm = exports.prettyUPLC = exports.showUPLC = exports.showConstType = exports.showUPLCConstValue = exports.isClosedTerm = exports.isPureUPLCTerm = exports.isUPLCTerm = void 0;
var UPLCVar_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCVar/index.js [app-client] (ecmascript)");
var Delay_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Delay.js [app-client] (ecmascript)");
var Lambda_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Lambda.js [app-client] (ecmascript)");
var Application_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Application.js [app-client] (ecmascript)");
var UPLCConst_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/UPLCConst.js [app-client] (ecmascript)");
var Force_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Force.js [app-client] (ecmascript)");
var ErrorUPLC_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/ErrorUPLC.js [app-client] (ecmascript)");
var Builtin_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/Builtin.js [app-client] (ecmascript)");
var ConstType_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstType/index.js [app-client] (ecmascript)");
var UPLCBuiltinTag_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/UPLCBuiltinTag.js [app-client] (ecmascript)");
var ConstValue_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstValue/index.js [app-client] (ecmascript)");
var bytestring_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bytestring@1.0.0/node_modules/@harmoniclabs/bytestring/dist/index.js [app-client] (ecmascript)");
var pair_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+pair@1.0.0/node_modules/@harmoniclabs/pair/dist/index.js [app-client] (ecmascript)");
var plutus_data_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+plutus-data@1.2.4/node_modules/@harmoniclabs/plutus-data/dist/index.js [app-client] (ecmascript)");
var assert_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)");
var Constr_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Constr.js [app-client] (ecmascript)");
var Case_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Case.js [app-client] (ecmascript)");
var crypto_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+crypto@0.2.5/node_modules/@harmoniclabs/crypto/dist/index.js [app-client] (ecmascript)");
var uint8array_utils_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uint8array-utils@1.0.4/node_modules/@harmoniclabs/uint8array-utils/dist/index.js [app-client] (ecmascript)");
/**
 * **_O(1)_**
 * @param {UPLCTerm} t ```UPLCTerm``` to check
 * @returns {boolean} ```true``` if the argument is instance of any of the ```UPLCTerm``` constructors, ```false``` otherwise
 */ function isUPLCTerm(t) {
    // only strict instances
    return t instanceof UPLCVar_1.UPLCVar || t instanceof Delay_1.Delay || t instanceof Lambda_1.Lambda || t instanceof Application_1.Application || t instanceof UPLCConst_1.UPLCConst || t instanceof Force_1.Force || t instanceof ErrorUPLC_1.ErrorUPLC || t instanceof Builtin_1.Builtin || t instanceof Constr_1.Constr || t instanceof Case_1.Case;
}
exports.isUPLCTerm = isUPLCTerm;
/**
 * **_O(n)_**
 * @param {UPLCTerm} t ```UPLCTerm``` to check
 * @returns {boolean} ```true``` if the AST contains only plutus-core terms, ```false``` otherwise
 */ function isPureUPLCTerm(t) {
    if (!isUPLCTerm(t)) return false;
    if (t instanceof UPLCVar_1.UPLCVar) return true;
    if (t instanceof Delay_1.Delay) return isPureUPLCTerm(t.delayedTerm);
    if (t instanceof Lambda_1.Lambda) return isPureUPLCTerm(t.body);
    if (t instanceof Application_1.Application) return isPureUPLCTerm(t.argTerm) && isPureUPLCTerm(t.funcTerm);
    if (t instanceof UPLCConst_1.UPLCConst) return true;
    if (t instanceof Force_1.Force) return isPureUPLCTerm(t.termToForce);
    if (t instanceof ErrorUPLC_1.ErrorUPLC) return true;
    if (t instanceof Builtin_1.Builtin) return true;
    if (t instanceof Constr_1.Constr) return t.terms.every(isPureUPLCTerm);
    if (t instanceof Case_1.Case) return isPureUPLCTerm(t.constrTerm) && t.continuations.every(isPureUPLCTerm);
    return false;
}
exports.isPureUPLCTerm = isPureUPLCTerm;
function _isClosedTerm(maxDeBruijn, t) {
    (0, assert_1.assert)(isUPLCTerm(t), "'isClosedTerm' functions only works on **raw** UPLCTerms");
    if (t instanceof UPLCVar_1.UPLCVar) // deBruijn variables are 0 indexed (as arrays)
    return maxDeBruijn > t.deBruijn;
    else if (t instanceof Delay_1.Delay) return _isClosedTerm(maxDeBruijn, t.delayedTerm);
    else if (t instanceof Lambda_1.Lambda) // increment max debruijn
    return _isClosedTerm(maxDeBruijn + BigInt(1), t.body);
    else if (t instanceof Application_1.Application) return _isClosedTerm(maxDeBruijn, t.funcTerm) && _isClosedTerm(maxDeBruijn, t.argTerm);
    else if (t instanceof UPLCConst_1.UPLCConst) // `UPLCConst` has no variables in it, ence always closed
    return true;
    else if (t instanceof Force_1.Force) return _isClosedTerm(maxDeBruijn, t.termToForce);
    else if (t instanceof ErrorUPLC_1.ErrorUPLC) // `ErrorUPLC` has no variables in it, ence always closed
    return true;
    else if (t instanceof Builtin_1.Builtin) // builtin per-se is just the function (ence a valid value),
    // arguments are passed using the `Apply` Term
    // so it is the `t instanceof Apply` case job
    // to be sure the arguments are closed
    return true;
    else if (t instanceof Constr_1.Constr) return t.terms.every(function(term) {
        return _isClosedTerm(maxDeBruijn, term);
    });
    else if (t instanceof Case_1.Case) return _isClosedTerm(maxDeBruijn, t.constrTerm) && t.continuations.every(function(term) {
        return _isClosedTerm(maxDeBruijn, term);
    });
    else throw new Error("unexpected execution flow in 'isClodeTerm'; all possibilieties should have already been handled; input term is: " + t.toString());
}
function isClosedTerm(term) {
    return _isClosedTerm(BigInt(0), term);
}
exports.isClosedTerm = isClosedTerm;
function showUPLCConstValue(v) {
    if (v === undefined) return "()";
    if ((0, ConstValue_1.isConstValueInt)(v)) return v.toString();
    if (typeof v === "string") return "\"".concat(v, "\"");
    if (typeof v === "boolean") return v ? "True" : "False";
    if (v instanceof bytestring_1.ByteString) return "#" + v.toString();
    if ((0, plutus_data_1.isData)(v)) return v.toString();
    if ((0, crypto_1.isBlsG1)(v)) return "0x".concat((0, uint8array_utils_1.toHex)((0, crypto_1.bls12_381_G1_compress)(v)));
    if ((0, crypto_1.isBlsG2)(v)) return "0x".concat((0, uint8array_utils_1.toHex)((0, crypto_1.bls12_381_G2_compress)(v)));
    if ((0, crypto_1.isBlsResult)(v)) return JSON.stringify(v, function(k, v) {
        return typeof v === "bigint" ? v.toString() : v;
    });
    if (Array.isArray(v)) return "[" + v.map(showUPLCConstValue).join(',') + "]";
    if (v instanceof pair_1.Pair) return "(".concat(showUPLCConstValue(v.fst), ",").concat(showUPLCConstValue(v.snd), ")");
    throw new Error("'showUPLCConstValue' did not matched any possible constant value");
}
exports.showUPLCConstValue = showUPLCConstValue;
function showConstType(t) {
    if (t[0] === ConstType_1.ConstTyTag.list) {
        return "(list ".concat(showConstType(ConstType_1.constListTypeUtils.getTypeArgument(t)), ")");
    }
    if (t[0] === ConstType_1.ConstTyTag.pair) {
        return "(pair ".concat(showConstType(ConstType_1.constPairTypeUtils.getFirstTypeArgument(t)), " ").concat(showConstType(ConstType_1.constPairTypeUtils.getSecondTypeArgument(t)), ")");
    }
    return (0, ConstType_1.constTypeToStirng)(t);
}
exports.showConstType = showConstType;
var vars = "abcdefghilmopqrstuvzwxyjkABCDEFGHILJMNOPQRSTUVZWXYJK".split('');
function getVarNameForDbn(dbn) {
    if (dbn < 0) return "(".concat(dbn, ")");
    if (dbn < vars.length) return vars[dbn];
    return vars[Math.floor(dbn / vars.length)] + getVarNameForDbn(dbn - vars.length);
}
function _showUPLC(t, dbn) {
    if (t instanceof UPLCVar_1.UPLCVar) {
        return getVarNameForDbn(dbn - 1 - Number(t.deBruijn));
    }
    if (t instanceof Delay_1.Delay) return "(delay ".concat(_showUPLC(t.delayedTerm, dbn), ")");
    if (t instanceof Lambda_1.Lambda) {
        return "(lam ".concat(getVarNameForDbn(dbn), " ").concat(_showUPLC(t.body, dbn + 1), ")");
    }
    if (t instanceof Application_1.Application) return "[".concat(_showUPLC(t.funcTerm, dbn), " ").concat(_showUPLC(t.argTerm, dbn), "]");
    if (t instanceof UPLCConst_1.UPLCConst) return "(con ".concat(showConstType(t.type), " ").concat(showUPLCConstValue(t.value), ")");
    if (t instanceof Force_1.Force) return "(force ".concat(_showUPLC(t.termToForce, dbn), ")");
    if (t instanceof ErrorUPLC_1.ErrorUPLC) return "(error)";
    if (t instanceof Builtin_1.Builtin) {
        var nForces = (0, UPLCBuiltinTag_1.getNRequiredForces)(t.tag);
        return "(force ".repeat(nForces) + "(builtin ".concat((0, UPLCBuiltinTag_1.builtinTagToString)(t.tag), ")") + ')'.repeat(nForces);
    }
    if (t instanceof Constr_1.Constr) {
        return "(constr " + t.index.toString() + " " + t.terms.map(function(term) {
            return _showUPLC(term, dbn);
        }).join(" ") + ")";
    }
    if (t instanceof Case_1.Case) {
        return "(case " + _showUPLC(t.constrTerm, dbn) + " " + t.continuations.map(function(term) {
            return _showUPLC(term, dbn);
        }).join(" ") + ")";
    }
    return "";
}
function showUPLC(term) {
    return _showUPLC(term, 0);
}
exports.showUPLC = showUPLC;
function prettyUPLC(term, _indent) {
    if (_indent === void 0) {
        _indent = 2;
    }
    if (!Number.isSafeInteger(_indent) || _indent < 1) return showUPLC(term);
    var indentStr = " ".repeat(_indent);
    function getVarNameForDbn(dbn) {
        if (dbn < 0) return "(".concat(dbn, ")");
        if (dbn < vars.length) return vars[dbn];
        return vars[Math.floor(dbn / vars.length)] + getVarNameForDbn(dbn - vars.length);
    }
    function _prettyUPLC(t, dbn, depth) {
        var indent = "\n".concat(indentStr.repeat(depth));
        if (t instanceof UPLCVar_1.UPLCVar) {
            return indent + getVarNameForDbn(dbn - 1 - Number(t.deBruijn));
        }
        if (t instanceof Delay_1.Delay) return "".concat(indent, "(delay ").concat(_prettyUPLC(t.delayedTerm, dbn, depth + 1)).concat(indent, ")");
        if (t instanceof Lambda_1.Lambda) {
            return "".concat(indent, "(lam ").concat(getVarNameForDbn(dbn), " ").concat(_prettyUPLC(t.body, dbn + 1, depth + 1)).concat(indent, ")");
        }
        if (t instanceof Application_1.Application) return "".concat(indent, "[").concat(_prettyUPLC(t.funcTerm, dbn, depth + 1), " ").concat(_prettyUPLC(t.argTerm, dbn, depth + 1)).concat(indent, "]");
        if (t instanceof UPLCConst_1.UPLCConst) return "".concat(indent, "(con ").concat(showConstType(t.type), " ").concat(showUPLCConstValue(t.value), ")");
        if (t instanceof Force_1.Force) return "".concat(indent, "(force ").concat(_prettyUPLC(t.termToForce, dbn, depth + 1)).concat(indent, ")");
        if (t instanceof ErrorUPLC_1.ErrorUPLC) return "(error)";
        if (t instanceof Builtin_1.Builtin) {
            var nForces = (0, UPLCBuiltinTag_1.getNRequiredForces)(t.tag);
            return indent + "(force ".repeat(nForces) + "(builtin ".concat((0, UPLCBuiltinTag_1.builtinTagToString)(t.tag), ")") + ')'.repeat(nForces);
        }
        if (t instanceof Constr_1.Constr) {
            var nextIndent = indent + indentStr;
            return indent + "(constr " + t.index.toString() + "\n" + nextIndent + "[" + t.terms.map(function(term) {
                return _prettyUPLC(term, dbn, depth + 2);
            }).join(",\n") + nextIndent + "]\n" + indent + ")";
        }
        if (t instanceof Case_1.Case) {
            var nextIndent = indent + indentStr;
            return indent + "(case\n" + _prettyUPLC(t.constrTerm, dbn, depth + 1) + "\n" + nextIndent + "[" + t.continuations.map(function(term) {
                return _prettyUPLC(term, dbn, depth + 2);
            }).join(",\n") + nextIndent + "]\n" + indent + ")";
        }
        return "";
    }
    return _prettyUPLC(term, 0, 0);
}
exports.prettyUPLC = prettyUPLC;
/**
 *
 * @param {number | bigint} varDeBruijn ```number | bigint```; debruijn level (at the term level) of the variable to search for
 * @param {UPLCTerm} t ```UPLCTerm``` to search in
 * @returns {boolean} ```true``` if the variable has **at least** 1 or more references; ```false``` otherwise
 */ function hasAnyRefsInTerm(varDeBruijn, t) {
    (0, assert_1.assert)(isUPLCTerm(t), "'getUPLCVarRefsInTerm' expects an UPLCTerms");
    var dbn = BigInt(varDeBruijn);
    if (t instanceof UPLCVar_1.UPLCVar) return t.deBruijn === dbn;
    if (t instanceof Delay_1.Delay) return hasAnyRefsInTerm(dbn, t.delayedTerm);
    if (t instanceof Lambda_1.Lambda) return hasAnyRefsInTerm(dbn + BigInt(1), t.body);
    if (t instanceof Application_1.Application) return hasAnyRefsInTerm(dbn, t.funcTerm) || hasAnyRefsInTerm(dbn, t.argTerm);
    if (t instanceof UPLCConst_1.UPLCConst) return false;
    if (t instanceof Force_1.Force) return hasAnyRefsInTerm(dbn, t.termToForce);
    if (t instanceof ErrorUPLC_1.ErrorUPLC) return false;
    if (t instanceof Builtin_1.Builtin) return false;
    if (t instanceof Constr_1.Constr) return t.terms.some(function(term) {
        return hasAnyRefsInTerm(dbn, term);
    });
    if (t instanceof Case_1.Case) return hasAnyRefsInTerm(dbn, t.constrTerm) || t.continuations.some(function(term) {
        return hasAnyRefsInTerm(dbn, term);
    });
    throw new Error("'hasAnyRefsInTerm' did not matched any possible 'UPLCTerm' constructor");
}
exports.hasAnyRefsInTerm = hasAnyRefsInTerm;
/**
 *
 * @param {number | bigint} varDeBruijn ```number | bigint```; debruijn level (at the term level) of the variable to search for
 * @param {UPLCTerm} term ```UPLCTerm``` to search in
 * @returns {boolean} ```true``` if the variable has 2 or more references; ```false``` otherwise
 */ function hasMultipleRefsInTerm(varDeBruijn, t) {
    (0, assert_1.assert)(isUPLCTerm(t), "'getUPLCVarRefsInTerm' expects an UPLCTerms");
    var dbn = BigInt(varDeBruijn);
    if (t instanceof UPLCVar_1.UPLCVar) return false; // single ref; case of multple refs is handled in 'Application' using 'hasAnyRefsInTerm'
    if (t instanceof Delay_1.Delay) return hasMultipleRefsInTerm(dbn, t.delayedTerm);
    if (t instanceof Lambda_1.Lambda) return hasMultipleRefsInTerm(dbn + BigInt(1), t.body);
    if (t instanceof Application_1.Application) return hasAnyRefsInTerm(dbn, t.funcTerm) && hasAnyRefsInTerm(dbn, t.argTerm) || // referenced at least once in both terms
    hasMultipleRefsInTerm(dbn, t.funcTerm) || // referenced multiple times in func 
    hasMultipleRefsInTerm(dbn, t.argTerm) // referenced multiple times in arg
    ;
    if (t instanceof UPLCConst_1.UPLCConst) return false;
    if (t instanceof Force_1.Force) return hasMultipleRefsInTerm(dbn, t.termToForce);
    if (t instanceof ErrorUPLC_1.ErrorUPLC) return false;
    if (t instanceof Builtin_1.Builtin) return false;
    if (t instanceof Constr_1.Constr) return termArrayHasManyRefs(dbn, t.terms);
    if (t instanceof Case_1.Case) {
        return hasAnyRefsInTerm(dbn, t.constrTerm) && t.continuations.some(function(term) {
            return hasAnyRefsInTerm(dbn, term);
        }) || hasMultipleRefsInTerm(dbn, t.constrTerm) || termArrayHasManyRefs(dbn, t.continuations);
    }
    throw new Error("getUPLCVarRefsInTerm did not matched any possible 'UPLCTerm' constructor");
}
exports.hasMultipleRefsInTerm = hasMultipleRefsInTerm;
function termArrayHasManyRefs(dbn, terms) {
    var idx = terms.findIndex(function(term) {
        return hasAnyRefsInTerm(dbn, term);
    });
    if (idx < 0) return false; // no refs at all;
    return terms.slice(idx + 1).some(function(term) {
        return hasAnyRefsInTerm(dbn, term);
    }) || terms.some(function(term) {
        return hasMultipleRefsInTerm(dbn, term);
    });
}
/**
 *
 * @param {number | bigint} varDeBruijn ```number | bigint```; debruijn level (at the term level) of the variable to search for
 * @param {UPLCTerm} term ```UPLCTerm``` to search in
 * @returns {number} number of references to the variable
 */ function getUPLCVarRefsInTerm(term, varDeBruijn) {
    if (varDeBruijn === void 0) {
        varDeBruijn = 0;
    }
    return _getUPLCVarRefsInTerm(BigInt(varDeBruijn), term, 0);
}
exports.getUPLCVarRefsInTerm = getUPLCVarRefsInTerm;
function _getUPLCVarRefsInTerm(dbn, t, countedUntilNow) {
    (0, assert_1.assert)(isUPLCTerm(t), "'getUPLCVarRefsInTerm' expects an UPLCTerms");
    if (t instanceof UPLCVar_1.UPLCVar) return countedUntilNow + (t.deBruijn === dbn ? 1 : 0);
    if (t instanceof Delay_1.Delay) return _getUPLCVarRefsInTerm(dbn, t.delayedTerm, countedUntilNow);
    if (t instanceof Lambda_1.Lambda) return _getUPLCVarRefsInTerm(dbn + BigInt(1), t.body, countedUntilNow);
    if (t instanceof Application_1.Application) return _getUPLCVarRefsInTerm(dbn, t.funcTerm, countedUntilNow) + _getUPLCVarRefsInTerm(dbn, t.argTerm, countedUntilNow);
    if (t instanceof UPLCConst_1.UPLCConst) return countedUntilNow;
    if (t instanceof Force_1.Force) return _getUPLCVarRefsInTerm(dbn, t.termToForce, countedUntilNow);
    if (t instanceof ErrorUPLC_1.ErrorUPLC) return countedUntilNow;
    if (t instanceof Builtin_1.Builtin) return countedUntilNow;
    if (t instanceof Constr_1.Constr) return t.terms.reduce(function(tot, term) {
        return _getUPLCVarRefsInTerm(dbn, term, tot);
    }, countedUntilNow);
    if (t instanceof Case_1.Case) return t.continuations.reduce(function(tot, term) {
        return _getUPLCVarRefsInTerm(dbn, term, tot);
    }, _getUPLCVarRefsInTerm(dbn, t.constrTerm, countedUntilNow));
    throw new Error("getUPLCVarRefsInTerm did not matched any possible 'UPLCTerm' constructor");
}
// type UPLCTerm = UPLCVar | Delay | Lambda | Application | UPLCConst | Force | ErrorUPLC | Builtin | Constr | Case;
function eqUPLCTerm(a, b) {
    if (a instanceof ErrorUPLC_1.ErrorUPLC) return b instanceof ErrorUPLC_1.ErrorUPLC;
    if (a instanceof UPLCVar_1.UPLCVar && b instanceof UPLCVar_1.UPLCVar) return a.deBruijn === b.deBruijn;
    if (a instanceof Delay_1.Delay && b instanceof Delay_1.Delay) return eqUPLCTerm(a.delayedTerm, b.delayedTerm);
    if (a instanceof Lambda_1.Lambda && b instanceof Lambda_1.Lambda) return eqUPLCTerm(a.body, b.body);
    if (a instanceof Application_1.Application && b instanceof Application_1.Application) return eqUPLCTerm(a.argTerm, b.argTerm) && eqUPLCTerm(a.funcTerm, b.funcTerm);
    if (a instanceof UPLCConst_1.UPLCConst && b instanceof UPLCConst_1.UPLCConst) return (0, ConstType_1.constTypeEq)(a.type, b.type) && (0, ConstValue_1.canConstValueBeOfConstType)(a.value, a.type) && (0, ConstValue_1.canConstValueBeOfConstType)(b.value, b.type) && function() {
        try {
            return (0, ConstValue_1.eqConstValue)(a.value, b.value);
        } catch (e) {
            if (e instanceof RangeError) return false;
            throw e;
        }
    }();
    if (a instanceof Force_1.Force && b instanceof Force_1.Force) return eqUPLCTerm(a.termToForce, b.termToForce);
    if (a instanceof Builtin_1.Builtin && b instanceof Builtin_1.Builtin) return a.tag === b.tag;
    if (a instanceof Constr_1.Constr && b instanceof Constr_1.Constr) return a.index === b.index && a.terms.length === b.terms.length && a.terms.every(function(t, i) {
        return eqUPLCTerm(t, b.terms[i]);
    });
    if (a instanceof Case_1.Case && b instanceof Case_1.Case) return eqUPLCTerm(a.constrTerm, b.constrTerm) && a.continuations.length === b.continuations.length && a.continuations.every(function(t, i) {
        return eqUPLCTerm(t, b.continuations[i]);
    });
    return false;
}
exports.eqUPLCTerm = eqUPLCTerm;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/BitUtils/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @static
 */ var BitUtils = function() {
    function BitUtils() {}
    /**
     * @deprecated not sure it has ever made sense to have it
     * @returns a number in range ```[ 0 , 255 ]``` ( ```[ 0b0000_0000, 0b1111_1111 ]``` ) based on the first byte
     */ BitUtils.getFirstByte = function(bits) {
        return Number("0x".concat(bits.toString(16).slice(0, 2)));
    };
    /**
     * @deprecated use ```andMaskOfLength``` instead
     */ BitUtils.andMaskOfLengthInt = function(n) {
        n = Math.round(Math.abs(n));
        // operatons used are valid on singed int32
        if (n >= 30) {
            return BitUtils.andMaskOfLength(BigInt(n));
        }
        return BigInt((1 << n) - 1);
    };
    /**
     * returns a ```bigint``` of that as the last ```n``` bits setted to ones;
     *
     * example
     * ```ts
     * BitUtils.getMaskOfLength( 7 ) === Bigint( 0b0111_1111 ); // true
     * ```
     */ BitUtils.andMaskOfLength = function(n) {
        return BigInt((BigInt(1) << n) - BigInt(1));
    };
    BitUtils.getNLastBits = function(fromNuber, nBits) {
        return fromNuber & BitUtils.andMaskOfLength(nBits);
    };
    /**
     * @returns the number of bits from the first setted to ```1``` on the left up until the end
     */ BitUtils.getNOfUsedBits = function(bits) {
        if (bits === BigInt(0)) return 0;
        return bits.toString(2).length;
    };
    BitUtils.minBytesRequired = function(bigint) {
        if (bigint < BigInt(0)) throw new Error("BitUtils.minBytesRequired works for positives integers only");
        var fullByteOnes = BigInt(255);
        var mask = fullByteOnes;
        var bytesRequired = 1;
        while(bigint !== (bigint & mask)){
            mask = mask << BigInt(8) | fullByteOnes;
            bytesRequired++;
        }
        return bytesRequired;
    };
    return BitUtils;
}();
exports.default = BitUtils;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/UPLCFlatUtils/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isInByteOffset = void 0;
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var BitUtils_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/BitUtils/index.js [app-client] (ecmascript)"));
var assert_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)");
function isInByteOffset(offset) {
    return offset === 0 || offset === 1 || offset === 2 || offset === 3 || offset === 4 || offset === 5 || offset === 6 || offset === 7;
}
exports.isInByteOffset = isInByteOffset;
/**
 * @static
 */ var UPLCFlatUtils = function() {
    /**
     * @deprecated this is a @static class, it is not supposed to have instances
     */ function UPLCFlatUtils() {}
    ;
    UPLCFlatUtils.zigzagBigint = function(bigint) {
        return bigint >> BigInt(BitUtils_1.default.getNOfUsedBits(bigint)) ^ bigint << BigInt(1);
    };
    UPLCFlatUtils.unzigzagBigint = function(bigint) {
        return bigint >> BigInt(1) ^ // XOR
        -(bigint & BigInt(1));
    };
    /**
     * source: https://hydra.iohk.io/build/5988492/download/1/plutus-core-specification.pdf#Variable%20length%20data
     *
     * Non-empty lists are encoded by prefixing the element stored with ‘0’ if this is the last element
     * or ‘1’ if there is more data following.
     *
     * We encode Integers as a non-empty list of chunks, 7 bits each, with the least significant chunk
     * first and the most significant bit first in the chunk.
     */ UPLCFlatUtils.encodeBigIntAsVariableLengthBitStream = function(integer) {
        (0, assert_1.assert)(typeof integer === "bigint", "expected a bigint as input; got instance of type: " + typeof integer);
        if (integer === BigInt(0)) return bitstream_1.BitStream.fromBinStr("00000000");
        (0, assert_1.assert)(integer > BigInt(0), "'UPLCFlatUtils.encodeBigIntAsVariableLengthBitStream' can only encode non-negative integers; the given input was: " + integer.toString());
        // store binary string for easy BitStream creation
        var chunks = [];
        var mask = BigInt(127);
        // 1. Converting to binary
        var nBits = BitUtils_1.default.getNOfUsedBits(integer);
        for(var nAddedBits = 0; nAddedBits < nBits; nAddedBits += 7){
            // 3. Reorder chunks (least significant chunk first)
            // 
            // push at the end because the mask starts from the last signigficat chunk first
            // so chunk[1] is the second least significant and so on
            chunks.push(// 2. Split into 7 bit chunks
            // take 7 bits
            ((integer & mask) >> BigInt(nAddedBits))// translate to biinary
            .toString(2)// make sure the bits are 7 in total
            .padStart(7, '0'));
            mask = mask << BigInt(7);
        }
        // 4. Add list constructor tags
        for(var i = 0; i < chunks.length; i++){
            chunks[i] = (i === chunks.length - 1 ? '0' : '1') + chunks[i];
        }
        return bitstream_1.BitStream.fromBinStr(chunks.join(''));
    };
    UPLCFlatUtils.getPadBitStream = function(n) {
        (0, assert_1.assert)(isInByteOffset(n), "addPadTo only works for pads from 0 inclusive to 7 inclusive");
        if (n === 0) {
            return bitstream_1.BitStream.fromBinStr("1".padStart(8, '0'));
        }
        return bitstream_1.BitStream.fromBinStr("1".padStart(n, '0'));
    };
    /**
     * **_SIDE EFFECT_**: modifies the ```toPad``` ```BitStream``` passed as first argument
     *
     * @param toPad
     * @param n
     * @returns
     */ UPLCFlatUtils.addPadTo = function(toPad, n) {
        (0, assert_1.assert)(bitstream_1.BitStream.isStrictInstance(toPad), "BitStream strict instance expected as first argument in 'UPLCFlatUtils.addPadTo'");
        toPad.append(UPLCFlatUtils.getPadBitStream(n));
        return;
    };
    Object.defineProperty(UPLCFlatUtils, "padToByteDefaultOptions", {
        get: function() {
            return Object.freeze({
                onByteAllignedAddNewByte: true,
                withOneAsEndPadding: true
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * **_SIDE EFFECT_**: modifies the ```toPad``` ```BitStream``` passed as first argument
     *
     * @param toPad
     * @param options
     * @returns
     */ UPLCFlatUtils.padToByte = function(toPad, options) {
        var opts = __assign(__assign({}, UPLCFlatUtils.padToByteDefaultOptions), options === undefined ? {} : options);
        var nBitsMissingToByte = toPad.getNBitsMissingToByte();
        if (nBitsMissingToByte === 0) {
            if (opts.onByteAllignedAddNewByte) {
                toPad.append(bitstream_1.BitStream.fromBinStr((opts.withOneAsEndPadding ? "1" : "0").padStart(8, '0')));
            } else {
            // do nothing, already alligned
            }
            return;
        }
        toPad.append(bitstream_1.BitStream.fromBinStr((opts.withOneAsEndPadding ? "1" : "0").padStart(nBitsMissingToByte, '0')));
        return;
    };
    return UPLCFlatUtils;
}();
exports.default = UPLCFlatUtils;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/UPLCTermTag.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UPLCTermTag = void 0;
var UPLCTermTag;
(function(UPLCTermTag) {
    UPLCTermTag[UPLCTermTag["Var"] = 0] = "Var";
    UPLCTermTag[UPLCTermTag["Delay"] = 1] = "Delay";
    UPLCTermTag[UPLCTermTag["Lambda"] = 2] = "Lambda";
    UPLCTermTag[UPLCTermTag["Application"] = 3] = "Application";
    UPLCTermTag[UPLCTermTag["Const"] = 4] = "Const";
    UPLCTermTag[UPLCTermTag["Force"] = 5] = "Force";
    UPLCTermTag[UPLCTermTag["Error"] = 6] = "Error";
    UPLCTermTag[UPLCTermTag["Builtin"] = 7] = "Builtin";
    UPLCTermTag[UPLCTermTag["Constr"] = 8] = "Constr";
    UPLCTermTag[UPLCTermTag["Case"] = 9] = "Case";
})(UPLCTermTag = exports.UPLCTermTag || (exports.UPLCTermTag = {}));
Object.freeze(UPLCTermTag);
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCDecoder/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseUPLC = exports.UPLCDecoder = void 0;
var UPLCProgram_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/UPLCProgram.js [app-client] (ecmascript)");
var UPLCVersion_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/UPLCVersion.js [app-client] (ecmascript)");
var UPLCTerm_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/UPLCTerm.js [app-client] (ecmascript)");
var Application_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Application.js [app-client] (ecmascript)");
var Builtin_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/Builtin.js [app-client] (ecmascript)");
var UPLCBuiltinTag_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/UPLCBuiltinTag.js [app-client] (ecmascript)");
var Delay_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Delay.js [app-client] (ecmascript)");
var ErrorUPLC_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/ErrorUPLC.js [app-client] (ecmascript)");
var Force_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Force.js [app-client] (ecmascript)");
var Lambda_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Lambda.js [app-client] (ecmascript)");
var UPLCVar_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCVar/index.js [app-client] (ecmascript)");
var UPLCConst_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/UPLCConst.js [app-client] (ecmascript)");
var ConstType_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstType/index.js [app-client] (ecmascript)");
var uint8array_utils_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uint8array-utils@1.0.4/node_modules/@harmoniclabs/uint8array-utils/dist/index.js [app-client] (ecmascript)");
var bytestring_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bytestring@1.0.0/node_modules/@harmoniclabs/bytestring/dist/index.js [app-client] (ecmascript)");
var cbor_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+cbor@1.6.0/node_modules/@harmoniclabs/cbor/dist/index.js [app-client] (ecmascript)");
var UPLCFlatUtils_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/UPLCFlatUtils/index.js [app-client] (ecmascript)"));
var bigint_utils_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bigint-utils@1.0.0/node_modules/@harmoniclabs/bigint-utils/dist/index.js [app-client] (ecmascript)");
var plutus_data_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+plutus-data@1.2.4/node_modules/@harmoniclabs/plutus-data/dist/index.js [app-client] (ecmascript)");
var pair_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+pair@1.0.0/node_modules/@harmoniclabs/pair/dist/index.js [app-client] (ecmascript)");
var UPLCTermTag_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/UPLCTermTag.js [app-client] (ecmascript)");
var Constr_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Constr.js [app-client] (ecmascript)");
var Case_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Case.js [app-client] (ecmascript)");
function isSerializedScriptFormat(str) {
    return typeof str === "string" && (str === "flat" || str === "cbor");
}
var UPLCDecoder = function() {
    function UPLCDecoder() {}
    UPLCDecoder.parse = function(serializedScript, format, debugLogs) {
        if (format === void 0) {
            format = "cbor";
        }
        if (debugLogs === void 0) {
            debugLogs = false;
        }
        if (!isSerializedScriptFormat(format)) {
            throw new Error("unknown format: " + format.toString());
        }
        if (format === "cbor") {
            var shouldTryParseCbor = true;
            var tmp = undefined;
            while(shouldTryParseCbor){
                try {
                    tmp = cbor_1.Cbor.parse(serializedScript);
                } catch (_a) {
                    shouldTryParseCbor = false;
                }
                if (!(tmp instanceof cbor_1.CborBytes)) {
                    shouldTryParseCbor = false;
                } else {
                    serializedScript = tmp.buffer;
                }
            }
            format = "flat";
        }
        // -------------------------- ctx steup -------------------------- //
        var currPtr = 0;
        var nBytes = serializedScript.length;
        var scriptBits = "0000000" + (0, bigint_utils_1.bigintFromBuffer)(serializedScript).toString(2);
        /**
         * dependencies:
         * - currPtr
         * - nBytes
         * - serializedScript
         */ var version = new UPLCVersion_1.UPLCVersion(readUInt(), readUInt(), readUInt());
        var isV3Friendly = version.isV3Friendly();
        var currDbn = 0;
        function incrementPtrBy(n) {
            currPtr += n;
        }
        function logState(forced) {
            if (forced === void 0) {
                forced = false;
            }
            if (forced || debugLogs) {
                console.log("UPLCDecoder state: " + JSON.stringify({
                    currPtr: currPtr,
                    bits: "..." + scriptBits.slice(currPtr - 16, currPtr + 16) + "...",
                    "ptr ": ' '.repeat(19) + '^',
                    currentByteIndex: currByteIndex(),
                    partialUPLC: partialUPLC
                }, undefined, 2));
            }
        }
        // --------------------------------------------------------------- //
        // ------------------------------ partial UPLC stuff ------------------------------ //
        var vars = "abcdefghilmopqrstuvzwxyjkABCDEFGHILJMNOPQRSTUVZWXYJK".split('');
        var partialUPLC = "";
        // -------------------------------------------------------------------------------- //
        /**
         * dependencies:
         * - currPtr
         * - nBytes
         */ function currByteIndex() {
            var idx = Math.floor(currPtr / 8);
            if (idx >= nBytes) throw new Error("pointer out of bound; ptr: " + currPtr + "; n bits: " + nBytes * 8);
            return idx;
        }
        /**
         * dependencies:
         * - currPtr
         * - nBytes
         * - serializedScript
         */ function currByte() {
            var byte = serializedScript.at(currByteIndex());
            if (byte === undefined) throw new Error("pointer out of bound; ptr: " + currPtr + "; n bits: " + nBytes * 8);
            return byte;
        }
        function getByteMask(nBits) {
            var mask = 0;
            for(var _nBits = Math.round(Math.abs(nBits)); _nBits > 0; _nBits--){
                mask = (mask << 1) + 1;
            }
            return mask;
        }
        function nthBitOfByte(nth, byte) {
            switch(nth){
                case 0:
                    return (byte & 128) >> 7;
                case 1:
                    return (byte & 64) >> 6;
                case 2:
                    return (byte & 32) >> 5;
                case 3:
                    return (byte & 16) >> 4;
                case 4:
                    return (byte & 8) >> 3;
                case 5:
                    return (byte & 4) >> 2;
                case 6:
                    return (byte & 2) >> 1;
                case 7:
                    return byte & 1;
                default:
                    throw new Error("can't access bit n: " + nth);
            }
        }
        /**
         * dependencies:
         * - currPtr
         * - nBytes
         * - serializedScript
         */ function readNBits(n) {
            if (n <= 0) return BigInt(0);
            var currB = currByte();
            var inBytePtr = currPtr % 8;
            if (n === 1) {
                incrementPtrBy(1);
                return BigInt(nthBitOfByte(inBytePtr, currB));
            }
            var missingBitsToByte = 8 - inBytePtr;
            var shift = missingBitsToByte - n;
            if (n <= missingBitsToByte) {
                incrementPtrBy(n);
                return BigInt((currB & getByteMask(n) << shift) >> shift);
            }
            incrementPtrBy(missingBitsToByte);
            var result = BigInt(currB & getByteMask(missingBitsToByte));
            var missingBitsToRead = n - missingBitsToByte;
            var nWholeBytes = 0;
            for(; (nWholeBytes + 1) * 8 < missingBitsToRead; nWholeBytes++){
                result = result << BigInt(8) & BigInt(currByte());
                incrementPtrBy(8);
            }
            missingBitsToRead = missingBitsToRead - nWholeBytes * 8;
            if (missingBitsToRead === 0) return result;
            return result << BigInt(missingBitsToRead) | readNBits(missingBitsToRead);
        }
        function readPadding() {
            while(Number(readNBits(1)) !== 1){}
            if (currPtr % 8 !== 0) throw new Error("padding was not alligned to byte; currPtr was: " + currPtr + "; currPtr % 8: " + currPtr % 8);
        }
        /**
         * dependencies:
         * - currPtr
         * - nBytes
         * - serializedScript
         */ function readUInt() {
            var n = BigInt(0);
            var wasLast = true;
            var nRed = 0;
            do {
                var red = readNBits(8);
                wasLast = (red & BigInt(128)) === BigInt(0);
                n = n | (red & BigInt(127)) << BigInt(nRed * 7);
                nRed++;
            }while (!wasLast)
            return n;
        }
        ;
        function readSignedInt() {
            return UPLCFlatUtils_1.default.unzigzagBigint(readUInt());
        }
        function readTerm() {
            var _a;
            // console.log( "left to read: " + serializedScript.subarray( currByteIndex() ).toString("hex") );
            logState();
            var tag = Number(readNBits(4));
            switch(tag){
                // serialised debruijn starts form 1;
                // plu-ts debruijn starts from 0
                case UPLCTermTag_1.UPLCTermTag.Var:
                    var _dbn = readUInt();
                    var dbn = Number(_dbn);
                    var idx = currDbn - (dbn - 1);
                    partialUPLC += (_a = vars[idx]) !== null && _a !== void 0 ? _a : "(".concat(idx.toString(), ")");
                    return new UPLCVar_1.UPLCVar(_dbn - BigInt(1));
                case UPLCTermTag_1.UPLCTermTag.Delay:
                    partialUPLC += "(delay ";
                    var delayed = readTerm();
                    partialUPLC += ")";
                    return new Delay_1.Delay(delayed);
                case UPLCTermTag_1.UPLCTermTag.Lambda:
                    partialUPLC += "(lam " + vars[currDbn] + ' ';
                    currDbn++;
                    var lamBody = readTerm();
                    currDbn--;
                    partialUPLC += ")";
                    return new Lambda_1.Lambda(lamBody);
                case UPLCTermTag_1.UPLCTermTag.Application:
                    partialUPLC += '[';
                    var appFn = readTerm();
                    partialUPLC += ' ';
                    var appArg = readTerm();
                    partialUPLC += ']';
                    return new Application_1.Application(appFn, appArg);
                case UPLCTermTag_1.UPLCTermTag.Const:
                    return readConst();
                case UPLCTermTag_1.UPLCTermTag.Force:
                    partialUPLC += "(force ";
                    var forced = readTerm();
                    partialUPLC += ')';
                    if (forced instanceof Builtin_1.Builtin) return forced;
                    if (forced instanceof Force_1.Force && forced.termToForce instanceof Builtin_1.Builtin) return forced.termToForce;
                    return new Force_1.Force(forced);
                case UPLCTermTag_1.UPLCTermTag.Error:
                    partialUPLC += "(error)";
                    return new ErrorUPLC_1.ErrorUPLC();
                case UPLCTermTag_1.UPLCTermTag.Builtin:
                    var bn_tag = Number(readNBits(7));
                    partialUPLC += "(builtin ".concat((0, UPLCBuiltinTag_1.builtinTagToString)(bn_tag), ")");
                    return new Builtin_1.Builtin(bn_tag);
                case UPLCTermTag_1.UPLCTermTag.Constr:
                    {
                        if (!isV3Friendly) throw new Error("found 'constr' node in uplc version " + version.toString() + "; lowest supported version is 1.1.0");
                        return new Constr_1.Constr(readUInt(), readTermList());
                    }
                    ;
                case UPLCTermTag_1.UPLCTermTag.Case:
                    {
                        if (!isV3Friendly) throw new Error("found 'case' node in uplc version " + version.toString() + "; lowest supported version is 1.1.0");
                        return new Case_1.Case(readTerm(), readTermList());
                    }
                    ;
                default:
                    throw new Error("unknown tag: " + tag + "; partialUPLC == " + partialUPLC);
            }
        }
        function readTermList() {
            var list = [];
            for(var head = Number(readNBits(1)); head !== 0; head = Number(readNBits(1))){
                list.push(readTerm());
            }
            return list;
        }
        function readConst() {
            logState();
            var constTy = readConstTy();
            if ((0, ConstType_1.constTypeEq)(constTy, ConstType_1.constT.bls12_381_G1_element) || (0, ConstType_1.constTypeEq)(constTy, ConstType_1.constT.bls12_381_G2_element) || (0, ConstType_1.constTypeEq)(constTy, ConstType_1.constT.bls12_381_MlResult)) throw new Error("bls constants are not supported in serialized UPLC");
            var val = readConstValueOfType(constTy);
            partialUPLC += "( con ".concat((0, UPLCTerm_1.showConstType)(constTy), " ").concat((0, UPLCTerm_1.showUPLCConstValue)(val), " )");
            return new UPLCConst_1.UPLCConst(constTy, val);
        }
        function readConstTy() {
            var head = Number(readNBits(1));
            if (head === 0) throw new Error("empty const type");
            var tyTag;
            var type = [];
            do {
                tyTag = Number(readNBits(4));
                head = Number(readNBits(1));
                if (tyTag === 7) continue;
                type.push(tyTag);
            }while (head !== 0)
            if (!(type.length > 0 && (0, ConstType_1.isWellFormedConstType)(type))) throw new Error("invalid constant type");
            return type;
        }
        function readConstValueOfType(t) {
            if ((0, ConstType_1.constTypeEq)(t, ConstType_1.constT.int)) {
                return readSignedInt();
            }
            if ((0, ConstType_1.constTypeEq)(t, ConstType_1.constT.byteStr)) {
                readPadding();
                var hexChunks = [];
                var chunkLen = 1;
                while(chunkLen !== 0){
                    chunkLen = Number(readNBits(8));
                    for(var i = 0; i < chunkLen; i++){
                        hexChunks.push(readNBits(8).toString(16).padStart(2, '0'));
                    }
                }
                return new bytestring_1.ByteString((0, uint8array_utils_1.fromHex)(hexChunks.join("")));
            }
            if ((0, ConstType_1.constTypeEq)(t, ConstType_1.constT.str)) {
                return (0, uint8array_utils_1.toUtf8)(readConstValueOfType(ConstType_1.constT.byteStr).toBuffer());
            }
            if ((0, ConstType_1.constTypeEq)(t, ConstType_1.constT.data)) {
                var bytes = readConstValueOfType(ConstType_1.constT.byteStr).toBuffer();
                return (0, plutus_data_1.dataFromCbor)(bytes);
            }
            if ((0, ConstType_1.constTypeEq)(t, ConstType_1.constT.bool)) return Number(readNBits(1)) === 1;
            if ((0, ConstType_1.constTypeEq)(t, ConstType_1.constT.unit)) return undefined;
            if (t[0] === ConstType_1.ConstTyTag.list) {
                var tyArg = ConstType_1.constListTypeUtils.getTypeArgument(t);
                var list = [];
                for(var head = Number(readNBits(1)); head !== 0; head = Number(readNBits(1))){
                    list.push(readConstValueOfType(tyArg));
                }
                return list;
            }
            if (t[0] === ConstType_1.ConstTyTag.pair) {
                return new pair_1.Pair(readConstValueOfType(ConstType_1.constPairTypeUtils.getFirstTypeArgument(t)), readConstValueOfType(ConstType_1.constPairTypeUtils.getSecondTypeArgument(t)));
            }
            ;
            throw new Error("'readConstValueOfType': no constant type matched");
        }
        return new UPLCProgram_1.UPLCProgram(version, readTerm());
    };
    return UPLCDecoder;
}();
exports.UPLCDecoder = UPLCDecoder;
function parseUPLC(serializedScript, format, debugLogs) {
    if (format === void 0) {
        format = "cbor";
    }
    if (debugLogs === void 0) {
        debugLogs = false;
    }
    return UPLCDecoder.parse(serializedScript, format, debugLogs);
}
exports.parseUPLC = parseUPLC;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCEncoder/UPLCSerializationContext.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UPLCSerializationContex = void 0;
var UPLCVersion_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/UPLCVersion.js [app-client] (ecmascript)");
function isV3Friendly(ctx) {
    // ^1.1.0 || >= 2.*.*
    return ctx.version.major === BigInt(1) ? ctx.version.minor >= 1 : ctx.version.major > 1;
}
var UPLCSerializationContex = function() {
    function UPLCSerializationContex(rawCtx) {
        this._rawCtx = __assign({
            currLength: 0,
            version: {
                major: BigInt(1),
                minor: BigInt(1),
                patch: BigInt(0)
            }
        }, rawCtx);
        this._is_v3_friendly = isV3Friendly(this._rawCtx);
    }
    Object.defineProperty(UPLCSerializationContex.prototype, "is_v3_friendly", {
        get: function() {
            return this._is_v3_friendly;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UPLCSerializationContex.prototype, "currLength", {
        get: function() {
            return this._rawCtx.currLength;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UPLCSerializationContex.prototype, "version", {
        get: function() {
            return new UPLCVersion_1.UPLCVersion(this._rawCtx.version.major, this._rawCtx.version.minor, this._rawCtx.version.patch);
        },
        enumerable: false,
        configurable: true
    });
    UPLCSerializationContex.prototype.updateVersion = function(uplcVersion) {
        this._rawCtx.version = {
            major: uplcVersion.major,
            minor: uplcVersion.minor,
            patch: uplcVersion.patch
        };
        this._is_v3_friendly = isV3Friendly(this._rawCtx);
    };
    UPLCSerializationContex.prototype.incrementLengthBy = function(n) {
        this._rawCtx.currLength = this._rawCtx.currLength + n;
    };
    return UPLCSerializationContex;
}();
exports.UPLCSerializationContex = UPLCSerializationContex;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCEncoder/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodeUPLC = exports.compileUPLC = exports.UPLCEncoder = exports.serializeBuiltin = void 0;
var ConstType_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstType/index.js [app-client] (ecmascript)");
var ConstValue_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstValue/index.js [app-client] (ecmascript)");
var UPLCBuiltinTag_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/UPLCBuiltinTag.js [app-client] (ecmascript)");
var UPLCTerm_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/UPLCTerm.js [app-client] (ecmascript)");
var Application_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Application.js [app-client] (ecmascript)");
var Builtin_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/Builtin.js [app-client] (ecmascript)");
var UPLCConst_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/UPLCConst.js [app-client] (ecmascript)");
var Delay_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Delay.js [app-client] (ecmascript)");
var ErrorUPLC_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/ErrorUPLC.js [app-client] (ecmascript)");
var Force_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Force.js [app-client] (ecmascript)");
var Lambda_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Lambda.js [app-client] (ecmascript)");
var UPLCVar_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCVar/index.js [app-client] (ecmascript)");
var UPLCSerializationContext_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCEncoder/UPLCSerializationContext.js [app-client] (ecmascript)");
var uint8array_utils_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uint8array-utils@1.0.4/node_modules/@harmoniclabs/uint8array-utils/dist/index.js [app-client] (ecmascript)");
var bitstream_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bitstream@1.0.0/node_modules/@harmoniclabs/bitstream/dist/index.js [app-client] (ecmascript)");
var bytestring_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bytestring@1.0.0/node_modules/@harmoniclabs/bytestring/dist/index.js [app-client] (ecmascript)");
var cbor_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+cbor@1.6.0/node_modules/@harmoniclabs/cbor/dist/index.js [app-client] (ecmascript)");
var pair_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+pair@1.0.0/node_modules/@harmoniclabs/pair/dist/index.js [app-client] (ecmascript)");
var plutus_data_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+plutus-data@1.2.4/node_modules/@harmoniclabs/plutus-data/dist/index.js [app-client] (ecmascript)");
var UPLCFlatUtils_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/UPLCFlatUtils/index.js [app-client] (ecmascript)"));
var assert_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/assert.js [app-client] (ecmascript)");
var Constr_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Constr.js [app-client] (ecmascript)");
var Case_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Case.js [app-client] (ecmascript)");
var crypto_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+crypto@0.2.5/node_modules/@harmoniclabs/crypto/dist/index.js [app-client] (ecmascript)");
/*
 * --------------------------- [encode vs serialize methods] ---------------------------
 *
 *  in the ```UPLCEncoder``` class are present various methods of which name starts with "encode" or "serialize"
 *  directly followed by the type of the expected argument.
 *
 *  all the "serialize" functions are **PURE**; meaning given the expected input those will return the output without executing side-effects;
 *
 *  all the "encode" methods have the side effect to update the context before and always return the equivalent of the "serialize" counterpart;
 *
 *  for this reason, when it is common the pattern
 *  ```ts
 *  encode( uplcObj: UPLC ): BitStream
 *  {
 *      const serialized = serilize( uplcObj );
 *      this._ctx.incrementLengthBy( serialized.length );
 *      return serialized;
 *  }
 *  ```
*/ function serializeUInt(uint) {
    return UPLCFlatUtils_1.default.encodeBigIntAsVariableLengthBitStream(BigInt(uint));
}
function serializeInt(int) {
    (0, assert_1.assert)(typeof int === "number" || typeof int === "bigint", "'serializeInt' only works for Signed Integer; " + "try using int.toSigned() if you are using a derived class; inpout was: " + int);
    int = typeof int === "number" ? BigInt(int) : int;
    return serializeUInt(UPLCFlatUtils_1.default.zigzagBigint(int));
}
function serializeVersion(version) {
    var result = serializeUInt(version.major);
    result.append(serializeUInt(version.minor));
    result.append(serializeUInt(version.patch));
    return result;
}
function serializeUPLCVar(uplcVar) {
    var result = UPLCVar_1.UPLCVar.UPLCTag;
    result.append(serializeUInt(// no idea why deBruijn indicies start form 1...s
    // can devs do something?
    uplcVar.deBruijn + BigInt(1)));
    return result;
}
function serializeConstType(type) {
    (0, assert_1.assert)((0, ConstType_1.isWellFormedConstType)(type), "cannot serialize an UPLC constant type if it is not well formed");
    /**
     *
     * Source: plutus-core-specification-june2022.pdf; section D.3.3; page 31
     *
     *  We define the encoder and decoder for types by combining 𝖾 𝗍𝗒𝗉𝖾 and 𝖽 𝗍𝗒𝗉𝖾 with 𝖤
     *  and decoder for lists of four-bit integers (see Section D.2).
     *
     * Section D.2 ( D.2.2 )
     *
     * Suppose that we have a set 𝑋 for which we have defined an encoder 𝖤 𝑋 and a decoder 𝖣 𝑋 ; we define an
⃖⃗     * 𝑋 which encodes lists of elements of 𝑋 by emitting the encodings of the elements of the list,
     * encoder 𝖤
     * **each preceded by a 𝟷 bit, then emitting a 𝟶 bit to mark the end of the list.**
     *
     */ function _serializeConstTyTagToUPLCBinaryString(typeTag) {
        if (typeTag === ConstType_1.ConstTyTag.list) {
            return "1" + "0111" + // cons + (7).toString(2).padStart( 4, '0' ) // type application
            "1" + "0101" // cons + (5).toString(2).padStart( 4, '0' ) // list
            ;
        } else if (typeTag === ConstType_1.ConstTyTag.pair) {
            return "1" + "0111" + // cons + (7).toString(2).padStart( 4, '0' ) // type application
            "1" + "0111" + // cons + (7).toString(2).padStart( 4, '0' ) // type application
            "1" + "0110" // cons + (5).toString(2).padStart( 4, '0' ) // pair
            ;
        } else if (typeTag === ConstType_1.ConstTyTag.bls12_381_G1_element || typeTag === ConstType_1.ConstTyTag.bls12_381_G2_element || typeTag === ConstType_1.ConstTyTag.bls12_381_MlResult) throw new Error("bls constants are not allowed in serialized UPLC");
        else {
            return "1" + typeTag.toString(2).padStart(4, '0');
        }
    }
    return bitstream_1.BitStream.fromBinStr(type.map(_serializeConstTyTagToUPLCBinaryString).join('') + "0");
}
/**
 * exported for testing purposes
 */ function serializeBuiltin(bn) {
    (0, assert_1.assert)((0, UPLCBuiltinTag_1.isUPLCBuiltinTag)(bn.tag), "while serializing a Builtin 'bn.tag' is not a valid builtin tag: bn.tag: " + bn.tag);
    var nRequiredForces = (0, UPLCBuiltinTag_1.getNRequiredForces)(bn.tag);
    var result = nRequiredForces === 0 ? new bitstream_1.BitStream(undefined) : bitstream_1.BitStream.fromBinStr("0101".repeat(nRequiredForces) // "force" tag repeated as necessary
    );
    result.append(Builtin_1.Builtin.UPLCTag);
    result.append(bitstream_1.BitStream.fromBinStr(bn.tag.toString(2).padStart(7, '0') // builtin tag takes 7 bits
    ));
    return result;
}
exports.serializeBuiltin = serializeBuiltin;
// ------------------------------------------------------------------------------------------------------------------- //
// --------------------------------------------------- UPLCEncoder --------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------------- //
var UPLCEncoder = function() {
    function UPLCEncoder() {
        this._ctx = new UPLCSerializationContext_1.UPLCSerializationContex({
            currLength: 0
        });
    }
    UPLCEncoder.prototype.compile = function(program) {
        var v = program.version;
        this._ctx.updateVersion(v);
        var uplc = program.body;
        if (!(0, UPLCTerm_1.isPureUPLCTerm)(uplc)) {
            throw new Error("'replaceHoisteTerm' did not return an 'UPLCTerm'");
        }
        // might modify version if necessary
        var encodedProgram = this.encodeTerm(uplc);
        // version is always byte-alligned
        var result = this.encodeVersion(this._ctx.version);
        result.append(encodedProgram);
        UPLCFlatUtils_1.default.padToByte(result);
        return result;
    };
    Object.defineProperty(UPLCEncoder, "compile", {
        get: function() {
            return function(program) {
                return new UPLCEncoder().compile(program);
            };
        },
        enumerable: false,
        configurable: true
    });
    /** always byte-alligned */ UPLCEncoder.prototype.encodeVersion = function(version) {
        var serialized = serializeVersion(version);
        this._ctx.incrementLengthBy(serialized.length);
        return serialized;
    };
    /** might modify version if necessary */ UPLCEncoder.prototype.encodeTerm = function(term) {
        if (term instanceof UPLCVar_1.UPLCVar) return this.encodeUPLCVar(term);
        if (term instanceof Delay_1.Delay) return this.encodeDelayTerm(term);
        if (term instanceof Lambda_1.Lambda) return this.encodeLambdaTerm(term);
        if (term instanceof Application_1.Application) return this.encodeApplicationTerm(term);
        if (term instanceof UPLCConst_1.UPLCConst) return this.encodeConstTerm(term);
        if (term instanceof Force_1.Force) return this.encodeForceTerm(term);
        if (term instanceof ErrorUPLC_1.ErrorUPLC) return this.encodeUPLCError(term);
        if (term instanceof Builtin_1.Builtin) return this.encodeBuiltin(term);
        if (term instanceof Constr_1.Constr) return this.encodeConstr(term);
        if (term instanceof Case_1.Case) return this.encodeCase(term);
        throw new Error("'UPLCEncoder.encodeTerm' did not match any 'PureUPLCTerm'");
    };
    UPLCEncoder.prototype.encodeUPLCVar = function(uplcVar) {
        var serialized = serializeUPLCVar(uplcVar);
        this._ctx.incrementLengthBy(serialized.length);
        return serialized;
    };
    UPLCEncoder.prototype.encodeDelayTerm = function(delayed) {
        var result = Delay_1.Delay.UPLCTag;
        this._ctx.incrementLengthBy(result.length);
        result.append(this.encodeTerm(delayed.delayedTerm));
        return result;
    };
    UPLCEncoder.prototype.encodeLambdaTerm = function(lam) {
        var result = Lambda_1.Lambda.UPLCTag;
        this._ctx.incrementLengthBy(result.length);
        /*
        only the body of the lambda is encoded since the new variable is implicit
        this is not referencied in any current specification but it is present in the `plutus` source code:

        Here is where they called encode with the binder while encoding a Lambda Term

        https://github.com/input-output-hk/plutus/blob/c8d4364d0e639fef4d5b93f7d6c0912d992b54f9/plutus-core/untyped-plutus-core/src/UntypedPlutusCore/Core/Instance/Flat.hs#L110


        Here is where binder is defined

        https://github.com/input-output-hk/plutus/blob/c8d4364d0e639fef4d5b93f7d6c0912d992b54f9/plutus-core/plutus-core/src/PlutusCore/Core/Type.hs#L228


        And (most importantly) where flat encoding for binder is derived

        https://github.com/input-output-hk/plutus/blob/c8d4364d0e639fef4d5b93f7d6c0912d992b54f9/plutus-core/plutus-core/src/PlutusCore/Flat.hs#L354
        */ result.append(this.encodeTerm(lam.body));
        return result;
    };
    UPLCEncoder.prototype.encodeApplicationTerm = function(app) {
        // if can use case/constr terms
        if (this._ctx.is_v3_friendly) {
            var args = [];
            var term = app;
            while(term instanceof Application_1.Application){
                // prepend element to keep same order
                args.unshift(term.argTerm);
                term = term.funcTerm;
            }
            // and we have more than 2 consecutive applications
            if (args.length > 2) {
                // use case and constr so that it costs
                // as much as only 2 applications
                return this.encodeCase(new Case_1.Case(new Constr_1.Constr(BigInt(0), args), // only one continutation; the last func term
                // (the one that expects the arguments)
                [
                    term
                ]));
            }
        // else continue with normal application encoding
        }
        // normal application encoding
        // always used in v1 and v2
        var result = Application_1.Application.UPLCTag;
        this._ctx.incrementLengthBy(result.length);
        result.append(this.encodeTerm(app.funcTerm));
        result.append(this.encodeTerm(app.argTerm));
        return result;
    };
    UPLCEncoder.prototype.encodeConstTerm = function(uplcConst) {
        var result = UPLCConst_1.UPLCConst.UPLCTag;
        result.append(serializeConstType(uplcConst.type));
        // tag and type where both context indipendent
        this._ctx.incrementLengthBy(result.length);
        result.append(this.encodeConstValue(uplcConst.value));
        return result;
    };
    UPLCEncoder.prototype.encodeConstValue = function(value) {
        (0, assert_1.assert)((0, ConstValue_1.isConstValue)(value), "a 'ConstValue' instance was expected; got" + value);
        if ((0, crypto_1.isBlsG1)(value) || (0, crypto_1.isBlsG2)(value) || (0, crypto_1.isBlsResult)(value)) throw new Error("bls constants are not allowed in serialized UPLC");
        if (value === undefined) return new bitstream_1.BitStream();
        if ((0, ConstValue_1.isConstValueInt)(value)) {
            var _i = serializeInt(value);
            // ints are always serialized in chunks of 8 bits
            // this should be irrelevant but still good to have
            this._ctx.incrementLengthBy(_i.length);
            return _i;
        }
        if (value instanceof bytestring_1.ByteString && bytestring_1.ByteString.isStrictInstance(value)) {
            // padding is added based on context
            return this.encodeConstValueByteString(value);
        }
        if (typeof value === "string") {
            /*
            Section D.2.6 Strings (page 28)
    
            We have defined values of the string type to be sequences of Unicode characters. As mentioned earlier
            we do not specify any particular internal representation of Unicode characters, but for serialisation we use
            the UTF-8 representation to convert between strings and bytestrings
            
            **and then use the bytestring encoder and decoder**:
            */ return this.encodeConstValue(new bytestring_1.ByteString((0, uint8array_utils_1.fromUtf8)(value)));
        }
        if (typeof value === "boolean") {
            var _b = bitstream_1.BitStream.fromBinStr(value === true ? "1" : "0");
            this._ctx.incrementLengthBy(_b.length);
            return _b;
        }
        if ((0, ConstValue_1.isConstValueList)(value)) {
            var result = new bitstream_1.BitStream();
            /*
            operations on bigints (BitStream underlying type) are O(n)
            appending first to this BitStream and then to the effective result
            should give us some performace improvements
            */ var listElem = void 0;
            for(var i = 0; i < value.length; i++){
                // cons
                listElem = bitstream_1.BitStream.fromBinStr("1");
                this._ctx.incrementLengthBy(1);
                // set list element
                listElem.append(this.encodeConstValue(value[i]));
                // append element
                // length already updated since using an "encode" function
                result.append(listElem);
            }
            // nil
            result.append(bitstream_1.BitStream.fromBinStr("0"));
            this._ctx.incrementLengthBy(1);
            return result;
        }
        if (value instanceof pair_1.Pair) {
            var result = this.encodeConstValue(value.fst);
            result.append(this.encodeConstValue(value.snd));
            return result;
        }
        if (value instanceof cbor_1.CborString) {
            value = (0, plutus_data_1.dataFromCbor)(value);
        }
        if ((0, plutus_data_1.isData)(value)) {
            return this.encodeConstValueData(value);
        }
        throw new Error("'this.encodeConstValue' did not matched any 'ConstValue' possible type; input was: " + value);
    };
    /**
     * ### Section D.3.5
     * The ```data``` type
     *
     * The 𝚍𝚊𝚝𝚊 type is encoded by converting to a bytestring using the CBOR encoding described in Note 1 of
     * Appendix B.2 and then using 𝖤 𝕌 ∗ . The decoding process is the opposite of this: a bytestring is obtained
     * using 𝖣 𝕌 ∗ and this is then decoded from CBOR to obtain a 𝚍𝚊𝚝𝚊 object.
     *
     * ### Section B.2
     *
     * **Note 1.** Serialising 𝚍𝚊𝚝𝚊 objects. The ```serialiseData``` function takes a 𝚍𝚊𝚝𝚊 object and converts it
     * into a CBOR (Bormann and Hoffman [2020]) object. The encoding is based on the Haskell Data type
     * described in Section A.1. A detailed description of the encoding will appear here at a later date, but for
     * the time being see the Haskell code in
     * [plutus-core/plutus-core/src/PlutusCore/Data.hs](https://github.com/input-output-hk/plutus/blob/master/plutus-core/plutus-core/src/PlutusCore/Data.hs)
     * ([```encodeData``` line](https://github.com/input-output-hk/plutus/blob/9ef6a65067893b4f9099215ff7947da00c5cd7ac/plutus-core/plutus-core/src/PlutusCore/Data.hs#L139))
     * in the Plutus GitHub repository IOHK [2019] for a definitive implementation.
     *
     * from the `encodeData` source:
     *
     * {- Note [The 64-byte limit]
     *    We impose a 64-byte *on-the-wire* limit on the leaves of a serialized 'Data'. This prevents people from inserting
     *    Mickey Mouse entire.
     *
     *    The simplest way of doing this is to check during deserialization that we never deserialize something that uses
     *    more than 64-bytes, and this is largely what we do. Then it's the user's problem to not produce something too big.
     *
     *    But this is quite inconvenient, so see Note [Evading the 64-byte limit] for how we get around this.
     * -}
     * {- Note [Evading the 64-byte limit]
     *  Implementing Note [The 64-byte limit] naively would be quite annoying:
     *  - Users would be responsible for not creating Data values with leaves that were too big.
     *  - If a script *required* such a thing (e.g. a counter that somehow got above 64 bytes), then the user is totally
     *  stuck: the script demands something they cannot represent.
     *
     *  This is unpleasant and introduces limits. Probably limits that nobody will hit, but it's nicer to just not have them.
     *  And it turns out that we can evade the problem with some clever encoding.
     *
     *  The fundamental
     *  trick is that an *indefinite-length* CBOR bytestring is just as obfuscated as a list of bytestrings,
     *  since it consists of a list of definite-length chunks, and each definite-length chunk must be *tagged* (at least with the size).
     *  So we get a sequence like:
     *
     *  <list start>
     *  <chunk length metadata>
     *  <chunk>
     *  <chunk length metadata>
     *  ...
     *  <list end>
     *
     *  The chunk length metadata has a prescribed format, such that it's difficult to manipulate it so that it
     *  matches your "desired" data.
     *  So this effectively breaks up the bytestring in much the same way as a list of <64 byte bytestrings.
     *
     *  So that solves the problem for bytestrings on the encoding side:
     *  - if they are <=64 bytes, we can just encode them as a normal bytestring
     *  - if they are >64 bytes, we encode them as indefinite-length bytestrings with 64-byte chunks
     *
     *  On the decoding side, we need to check when we decode that we never decode a definite-length
     *  bytestring of >64 bytes. That covers our two cases:
     *  - Short definite-length bytestrings are fine
     *  - Long indefinite-length bytestrings are just made of short definite-length bytestings.
     *
     *   *  Unfortunately this all means that we have to write our own encoders/decoders so we can produce
     *   *  chunks of the right size and check the sizes when we decode, but that's okay. Users need to do the same
     *   *  thing: anyone encoding `Data` with their own encoders who doesn't split up big bytestrings in this way
     *   *  will get failures when we decode them.
     *
     *  For integers, we have two cases. Small integers (<=64bits) can be encoded normally. Big integers are already
     *  encoded *with a byte string*. The spec allows this to be an indefinite-length bytestring (although cborg doesn't
     *  like it), so we can reuse our trick. Again, we need to write some manual encoders/decoders.
     *  -}
     */ UPLCEncoder.prototype.encodeConstValueData = function(data) {
        var cborBytes = (0, plutus_data_1.dataToCbor)(data).toBuffer();
        /*
        **NOTE**

        large data encoding

        Before we thought this was only an UPLC serialization problem;
        and that the UPLC builtin `serialiseData` would have just resulted
        in a normal CBOR bytestring, no matter the length.

        section 4.3.2 (Note 1) is instead clear that the above was not the case
        and that the `serialiseData` is subject to the same serialization with
        hard coded limit on bytestrings length

        `dataToCbor` was fixed accordingly since `@harmoniclabs/plutus-data@^1.2.0`
        so we can rely on that function both in UPLC serialization
        and on-chain builtin `serialiseData` execution
        */ return this.encodeConstValueByteString(new bytestring_1.ByteString(cborBytes));
    };
    /**
     * latest specification (**_section D.2.5 Bytestrings; page 27_**)
     * specifies how bytestrings are byte-alligned before and the first byte indicates the length
     *
     * **this function takes care of the length AND padding**
     *
     */ UPLCEncoder.prototype.encodeConstValueByteString = function(bs) {
        var missingBytes = bs.toString();
        var hexChunks = [];
        while(missingBytes.length / 2 > 255){
            hexChunks.push("ff" + missingBytes.slice(0, 255 * 2));
            missingBytes = missingBytes.slice(255 * 2);
        }
        if (missingBytes.length !== 0) {
            hexChunks.push((missingBytes.length / 2).toString(16).padStart(2, '0') + missingBytes);
        }
        // end chunk
        hexChunks.push("00");
        var nPadBits = 8 - this._ctx.currLength % 8;
        // add initial padding as needed by context
        var result = bitstream_1.BitStream.fromBinStr("1".padStart(nPadBits, '0'));
        // append chunks
        result.append(new bitstream_1.BitStream((0, uint8array_utils_1.fromHex)(hexChunks.join('')), 0));
        this._ctx.incrementLengthBy(result.length);
        return result;
    };
    UPLCEncoder.prototype.encodeForceTerm = function(force) {
        if (force.termToForce instanceof Delay_1.Delay) {
            // cancels direct delays
            return this.encodeTerm(force.termToForce.delayedTerm);
        }
        var result = Force_1.Force.UPLCTag;
        this._ctx.incrementLengthBy(result.length);
        result.append(this.encodeTerm(force.termToForce));
        return result;
    };
    UPLCEncoder.prototype.encodeUPLCError = function(_term) {
        var errTag = ErrorUPLC_1.ErrorUPLC.UPLCTag;
        this._ctx.incrementLengthBy(errTag.length);
        return errTag.clone();
    };
    UPLCEncoder.prototype.encodeBuiltin = function(bn) {
        var result = serializeBuiltin(bn);
        this._ctx.incrementLengthBy(result.length);
        return result;
    };
    UPLCEncoder.prototype.encodeConstr = function(constr) {
        if (!this._ctx.is_v3_friendly) throw new Error("'Constr' term found using UPLC version " + this._ctx.version.toString() + "; maybe you wanted to use version 1.1.0 or higher?");
        var result = Constr_1.Constr.UPLCTag;
        result.append(serializeUInt(constr.index));
        this._ctx.incrementLengthBy(result.length);
        result.append(this.encodeTermList(constr.terms));
        return result;
    };
    UPLCEncoder.prototype.encodeCase = function(caseTerm) {
        if (!this._ctx.is_v3_friendly) throw new Error("'Case' term found using UPLC version " + this._ctx.version.toString() + "; maybe you wanted to use version 1.1.0 or higher?");
        var result = Case_1.Case.UPLCTag;
        this._ctx.incrementLengthBy(result.length);
        result.append(this.encodeTerm(caseTerm.constrTerm));
        result.append(this.encodeTermList(caseTerm.continuations));
        return result;
    };
    UPLCEncoder.prototype.encodeTermList = function(list) {
        var _this = this;
        if (list.length === 0) {
            this._ctx.incrementLengthBy(1);
            return bitstream_1.BitStream.fromBinStr("0");
        }
        ;
        var ctx = this._ctx;
        var result = list.reduce(function(accum, elem) {
            var result = bitstream_1.BitStream.fromBinStr("1");
            // increment BEFORE `this.encodeTerm`
            ctx.incrementLengthBy(1);
            result.append(_this.encodeTerm(elem));
            accum.append(result);
            return accum;
        }, new bitstream_1.BitStream(undefined));
        ctx.incrementLengthBy(1);
        result.append(bitstream_1.BitStream.fromBinStr("0"));
        return result;
    };
    return UPLCEncoder;
}();
exports.UPLCEncoder = UPLCEncoder;
function compileUPLC(program) {
    return new UPLCEncoder().compile(program);
}
exports.compileUPLC = compileUPLC;
/**
 * alias for `compileUPLC`
 */ exports.encodeUPLC = compileUPLC;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/UPLCProgram.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/UPLCVersion.js [app-client] (ecmascript)"), exports);
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/Builtin.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/UPLCBuiltinTag.js [app-client] (ecmascript)"), exports);
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/UPLCConst.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstType/index.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/ConstValue/index.js [app-client] (ecmascript)"), exports);
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Application.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Builtin/index.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Delay.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/ErrorUPLC.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Force.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Lambda.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCConst/index.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/UPLCVar/index.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Constr.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/Case.js [app-client] (ecmascript)"), exports);
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/indexOfNextCommaOutsideParentesis.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.indexOfNextCommaOutsideParentesis = void 0;
function indexOfNextCommaOutsideParentesis(str) {
    for(var i = 0, ch = "", nOpen = 0, nBrackets = 0; i < str.length; i++){
        ch = str[i];
        if (ch === "(") nOpen++;
        else if (ch === ")") nOpen--;
        else if (ch === "[") nBrackets++;
        else if (ch === "]") nBrackets--;
        else if (ch === "," && nOpen <= 0 && nBrackets <= 0) return i;
    }
    return -1;
}
exports.indexOfNextCommaOutsideParentesis = indexOfNextCommaOutsideParentesis;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/indexOfNextUnmatchedParentesis.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.indexOfNextUnmatchedParentesis = void 0;
function indexOfNextUnmatchedParentesis(str) {
    for(var i = 0, ch = "", nOpen = 0; i < str.length; i++){
        ch = str[i];
        if (ch === "(") nOpen++;
        else if (ch === ")") nOpen--;
        if (nOpen < 0) return i;
    }
    return -1;
}
exports.indexOfNextUnmatchedParentesis = indexOfNextUnmatchedParentesis;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/getTextBetweenMatchingQuotes.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTextBetweenMatchingQuotes = void 0;
function getTextBetweenMatchingQuotes(str) {
    for(var i = 0, ch = "", openIdx = -1; i < str.length; i++){
        ch = str[i];
        if (ch === '"') {
            if (openIdx < 0) openIdx = i;
            else return str.slice(openIdx + 1, i);
        } else if (ch === "\\") i++; // grab whatever is next
    }
    return undefined;
}
exports.getTextBetweenMatchingQuotes = getTextBetweenMatchingQuotes;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/indexOfMany.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.indexOfMany = void 0;
function indexOfMany(str) {
    var search = [];
    for(var _i = 1; _i < arguments.length; _i++){
        search[_i - 1] = arguments[_i];
    }
    var idxs = search.map(function(toSearch) {
        return str.indexOf(toSearch);
    }).filter(function(idx) {
        return idx >= 0;
    });
    return idxs.length === 0 ? -1 : Math.min.apply(Math, __spreadArray([], __read(idxs), false));
}
exports.indexOfMany = indexOfMany;
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/parseUPLCText.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getOffsetToNextClosingBracket = exports.parseUPLCText = exports.parseConstType = exports.parseConstValueOfType = exports._parseUPLCText = void 0;
var bytestring_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+bytestring@1.0.0/node_modules/@harmoniclabs/bytestring/dist/index.js [app-client] (ecmascript)");
var UPLCTerms_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/index.js [app-client] (ecmascript)");
var plutus_data_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+plutus-data@1.2.4/node_modules/@harmoniclabs/plutus-data/dist/index.js [app-client] (ecmascript)");
var pair_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+pair@1.0.0/node_modules/@harmoniclabs/pair/dist/index.js [app-client] (ecmascript)");
var crypto_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+crypto@0.2.5/node_modules/@harmoniclabs/crypto/dist/index.js [app-client] (ecmascript)");
var uint8array_utils_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uint8array-utils@1.0.4/node_modules/@harmoniclabs/uint8array-utils/dist/index.js [app-client] (ecmascript)");
var indexOfNextCommaOutsideParentesis_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/indexOfNextCommaOutsideParentesis.js [app-client] (ecmascript)");
var indexOfNextUnmatchedParentesis_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/indexOfNextUnmatchedParentesis.js [app-client] (ecmascript)");
var getTextBetweenMatchingQuotes_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/getTextBetweenMatchingQuotes.js [app-client] (ecmascript)");
var indexOfMany_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/utils/indexOfMany.js [app-client] (ecmascript)");
var UPLCProgram_1 = __turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/index.js [app-client] (ecmascript)");
function _parseUPLCText(str, env, dbn, version) {
    // clone (other branches migh modify vars dbns)
    env = __assign({}, env);
    var offset = 0;
    var sliceTrimIncr = function(n) {
        if (n === void 0) {
            n = 0;
        }
        var tmp = str.length;
        str = str.slice(n).trimStart();
        offset += tmp - str.length;
    };
    var throwIllFormed = function() {
        // console.error( str );
        throw new Error("ill formed uplc text");
    };
    var getNextWord = function(s) {
        if (s === void 0) {
            s = str;
        }
        var fstSpaceIdx = s.search(/\s/);
        if (fstSpaceIdx < 0) fstSpaceIdx = str.length - 1;
        var varName = s.slice(0, fstSpaceIdx).trim();
        while(varName.endsWith(")") || varName.endsWith("]") || varName.endsWith(" ") || varName.endsWith("\n")){
            varName = varName.slice(0, varName.length - 1);
        }
        return varName;
    };
    sliceTrimIncr(0);
    var ch = str[0];
    // drop the opening bracket;
    if (ch === "[") {
        sliceTrimIncr(1);
        offset += getOffsetToNextClosingBracket(str, "[", "]");
        var fn = _parseUPLCText(str, env, dbn, version);
        str = str.slice(fn.offset + 1);
        var arg = _parseUPLCText(str, env, dbn, version);
        return {
            term: new UPLCTerms_1.Application(fn.term, arg.term),
            offset: offset
        };
    }
    if (ch === "(") {
        sliceTrimIncr(1);
        if (str.startsWith("error")) {
            offset += getOffsetToNextClosingBracket(str, "(", ")");
            return {
                term: new UPLCTerms_1.ErrorUPLC(),
                offset: offset
            };
        }
        if (str.startsWith("delay")) {
            offset += getOffsetToNextClosingBracket(str, "(", ")");
            return {
                term: new UPLCTerms_1.Delay(_parseUPLCText(str.slice(5), env, dbn, version).term),
                offset: offset
            };
        }
        if (str.startsWith("force")) {
            offset += getOffsetToNextClosingBracket(str, "(", ")");
            var directChild = _parseUPLCText(str.slice(5), env, dbn, version).term;
            if (directChild instanceof UPLCTerms_1.Builtin && (0, UPLCTerms_1.getNRequiredForces)(directChild.tag) === 1) return {
                term: directChild,
                offset: offset
            };
            if (directChild instanceof UPLCTerms_1.Force && directChild.termToForce instanceof UPLCTerms_1.Builtin && (0, UPLCTerms_1.getNRequiredForces)(directChild.termToForce.tag) === 2) return {
                term: directChild.termToForce,
                offset: offset
            };
            return {
                term: new UPLCTerms_1.Force(directChild),
                offset: offset
            };
        }
        if (str.startsWith("builtin")) {
            offset += getOffsetToNextClosingBracket(str, "(", ")");
            str = str.slice(7).trimStart();
            return {
                term: new UPLCTerms_1.Builtin((0, UPLCTerms_1.builtinTagFromString)(getNextWord())),
                offset: offset
            };
        }
        if (str.startsWith("lam")) {
            offset += getOffsetToNextClosingBracket(str, "(", ")");
            str = str.slice(3).trimStart();
            var varName_1 = getNextWord();
            str = str.slice(varName_1.length).trimStart();
            env[varName_1] = dbn;
            return {
                term: new UPLCTerms_1.Lambda(_parseUPLCText(str, env, dbn + 1, version).term),
                offset: offset
            };
        }
        if (str.startsWith("case")) {
            if (!version.isV3Friendly()) throw new Error("case uplc node found on program version: " + version.toString());
            sliceTrimIncr(4);
            var closeIdx = (0, indexOfNextUnmatchedParentesis_1.indexOfNextUnmatchedParentesis)(str);
            str = str.slice(0, closeIdx).trim();
            var terms = [];
            while(str.length > 0){
                var _a = _parseUPLCText(str, env, dbn, version), term = _a.term, offset_1 = _a.offset;
                terms.push(term);
                str = str.slice(offset_1).trim();
            }
            if (terms.length < 1) throw new Error("ill formed uplc, missing constr term on case");
            return {
                term: new UPLCTerms_1.Case(terms.shift(), terms),
                offset: offset + closeIdx + 1
            };
        }
        // "constr" MUST BE before "con"
        if (str.startsWith("constr")) {
            if (!version.isV3Friendly()) throw new Error("case uplc node found on program version: " + version.toString());
            sliceTrimIncr(6);
            var closeIdx = (0, indexOfNextUnmatchedParentesis_1.indexOfNextUnmatchedParentesis)(str);
            str = str.slice(0, closeIdx);
            var _b = parseConstValueOfType(str, UPLCTerms_1.constT.int), idx = _b.value, idxOffset = _b.offset;
            str = str.slice(idxOffset);
            if (typeof idx !== "bigint") throw new Error("ill formed uplc; constr expects u64 index");
            var terms = [];
            str = str.trim();
            while(str.length > 0){
                var _c = _parseUPLCText(str, env, dbn, version), term = _c.term, offset_2 = _c.offset;
                terms.push(term);
                str = str.slice(offset_2).trim();
            }
            return {
                term: new UPLCTerms_1.Constr(idx, terms),
                offset: offset + closeIdx + 1
            };
        }
        if (str.startsWith("con")) {
            offset += getOffsetToNextClosingBracket(str, "(", ")");
            str = str.slice(3).trimStart();
            var t = parseConstType(str);
            str = str.slice(t.offset).trimStart();
            var v = parseConstValueOfType(str, t.type);
            str = str.slice(v.offset).trimStart();
            return {
                term: new UPLCTerms_1.UPLCConst(t.type, v.value),
                offset: offset
            };
        }
    }
    // else var
    offset--;
    var varName = getNextWord();
    offset += varName.length;
    if (varName.startsWith("-")) {
        return {
            term: new UPLCTerms_1.UPLCVar(dbn + parseInt(varName.slice(1)) - 1),
            offset: offset
        };
    }
    var varDbn = env[varName];
    if (varDbn === undefined) {
        // console.log( env, `"${varName}"`, Object.keys( env )[0] === varName )
        // throwIllFormed();
        throw new Error("unbound variable found");
    }
    return {
        term: new UPLCTerms_1.UPLCVar(dbn - 1 - varDbn),
        offset: offset
    };
}
exports._parseUPLCText = _parseUPLCText;
var hexChars = Array.from("0123456789abcdef");
function isHexChar(ch) {
    return hexChars.includes(ch[0].toLowerCase());
}
function isLowestNonNegative(a, b) {
    return a >= 0 && (b < 0 || a < b);
}
function parseConstValueOfType(str, t) {
    var offset = 0;
    var sliceTrimIncr = function(n) {
        if (n === void 0) {
            n = 0;
        }
        var tmp = str.length;
        str = str.slice(n).trimStart();
        offset += tmp - str.length;
    };
    sliceTrimIncr(0);
    if ((0, UPLCTerms_1.constTypeEq)(t, UPLCTerms_1.constT.unit)) {
        sliceTrimIncr(str.indexOf("()") + 2);
        return {
            value: undefined,
            offset: offset
        };
    }
    if ((0, UPLCTerms_1.constTypeEq)(t, UPLCTerms_1.constT.int)) {
        var closeIndex = str.indexOf(")");
        var regExpRes = str.slice(0, closeIndex < 0 ? undefined : closeIndex)// \+?\-?           -> may or may nost start with "+" or "-"
        // (?<!\.)          -> MUST NOT have dots before
        // (?<!(#|x)\d*)    -> MUST NOT have before "#" or "x" with 0 or more digits (escluded bls elements and bytestrings)
        // \d+              -> one or more digits
        // (?!(\.|x))       -> MUST NOT have dots after or "x" (x excludes "0x" which are bls elems)
        .match(RegExp("\\+?\\-?(?<!\\.)(?<!(#|x)\\d*)\\d+(?!(\\.|x))"));
        if (regExpRes === null) throw new Error("could not find integer for constant uplc");
        var nStr = regExpRes[0];
        var value = BigInt(nStr);
        sliceTrimIncr(str.indexOf(nStr) + nStr.length);
        return {
            value: value,
            offset: offset
        };
    }
    if ((0, UPLCTerms_1.constTypeEq)(t, UPLCTerms_1.constT.str)) {
        var quoteIdx = str.indexOf('"');
        if (!/^\s*$/.test(str.slice(0, quoteIdx))) throw new Error("ill formed uplc");
        sliceTrimIncr(quoteIdx);
        var value = (0, getTextBetweenMatchingQuotes_1.getTextBetweenMatchingQuotes)(str);
        if (typeof value !== "string") throw new Error("missing constant string value");
        sliceTrimIncr(value.length + 2);
        return {
            value: value,
            offset: offset
        };
    }
    if ((0, UPLCTerms_1.constTypeEq)(t, UPLCTerms_1.constT.bool)) {
        var trueIdx = str.indexOf("True");
        var falseIdx = str.indexOf("False");
        if (trueIdx < 0 && falseIdx < 0) throw new Error("expected boolean value; found none");
        var isTrue = isLowestNonNegative(trueIdx, falseIdx);
        if (isTrue) {
            sliceTrimIncr(trueIdx + 4);
            return {
                value: true,
                offset: offset
            };
        } else {
            sliceTrimIncr(falseIdx + 5);
            return {
                value: false,
                offset: offset
            };
        }
    }
    if ((0, UPLCTerms_1.constTypeEq)(t, UPLCTerms_1.constT.byteStr)) {
        sliceTrimIncr(str.indexOf("#") + 1);
        var i = 0;
        while(i < str.length && isHexChar(str[i++]));
        !isHexChar(str[i - 1]) && i--;
        var hex = str.slice(0, i);
        // we can handle it but plutus conformance doesn't allow it
        if (hex.length % 2 === 1) {
            throw new Error("invalid bytestring value: received: " + hex);
        }
        sliceTrimIncr(i);
        return {
            value: new bytestring_1.ByteString(hex),
            offset: offset
        };
    }
    if ((0, UPLCTerms_1.constTypeEq)(t, UPLCTerms_1.constT.data)) {
        sliceTrimIncr(0);
        var _a = (0, plutus_data_1.dataFromStringWithOffset)(str), data = _a.data, dataOffset = _a.offset;
        offset += dataOffset;
        return {
            value: data,
            offset: offset
        };
    }
    if ((0, UPLCTerms_1.constTypeEq)(t, UPLCTerms_1.constT.bls12_381_G1_element)) {
        var original = str;
        str = str.slice(0, str.indexOf(")") + 1).trimStart();
        offset += original.length - original.indexOf(str) + 2 /*0x*/  + 96;
        var match = str.match(/^0x[0-9a-fA-F]{96}(?![0-9a-fA-F]+)/); // 48 bytes; 96 hex chars
        if (!match) throw new Error("missing bls g1 compressed elem");
        var value = (0, crypto_1.bls12_381_G1_uncompress)((0, uint8array_utils_1.fromHex)(match[0].slice(2)));
        return {
            value: value,
            offset: offset
        };
    }
    if ((0, UPLCTerms_1.constTypeEq)(t, UPLCTerms_1.constT.bls12_381_G2_element)) {
        var original = str;
        str = str.slice(0, str.indexOf(")") + 1).trimStart();
        offset += original.length - original.indexOf(str) + 2 /*0x*/  + 192;
        var match = str.match(/^0x[0-9a-fA-F]{192}(?![0-9a-fA-F]+)/); // 96 bytes; 192 hex chars
        if (!match) throw new Error("missing bls g2 compressed elem");
        var value = (0, crypto_1.bls12_381_G2_uncompress)((0, uint8array_utils_1.fromHex)(match[0].slice(2)));
        return {
            value: value,
            offset: offset
        };
    }
    if ((0, UPLCTerms_1.constTypeEq)(t, UPLCTerms_1.constT.bls12_381_MlResult)) {
        throw new Error("bls12_381_MlResult const type not supported");
    }
    if (t[0] === UPLCTerms_1.ConstTyTag.pair) {
        sliceTrimIncr(str.indexOf("(") + 1);
        var commaIdx = (0, indexOfNextCommaOutsideParentesis_1.indexOfNextCommaOutsideParentesis)(str);
        var fst = parseConstValueOfType(str.slice(0, commaIdx), UPLCTerms_1.constPairTypeUtils.getFirstTypeArgument(t));
        sliceTrimIncr(commaIdx + 1);
        var closeIdx = (0, indexOfNextUnmatchedParentesis_1.indexOfNextUnmatchedParentesis)(str);
        var snd = parseConstValueOfType(str.slice(0, closeIdx), UPLCTerms_1.constPairTypeUtils.getSecondTypeArgument(t));
        sliceTrimIncr(closeIdx + 1);
        return {
            value: new pair_1.Pair(fst.value, snd.value),
            offset: offset
        };
    }
    if (t[0] === UPLCTerms_1.ConstTyTag.list) {
        sliceTrimIncr(str.indexOf("[") + 1);
        var elemsT = UPLCTerms_1.constListTypeUtils.getTypeArgument(t);
        var elems = [];
        while(!str.startsWith("]")){
            var elem = parseConstValueOfType(str, elemsT);
            sliceTrimIncr(elem.offset);
            sliceTrimIncr(str.indexOf(",") + 1);
            elems.push(elem.value);
        }
        return {
            value: elems,
            offset: offset
        };
    }
    throw new Error("unknown const type");
}
exports.parseConstValueOfType = parseConstValueOfType;
function parseConstType(str) {
    var offset = 0;
    var sliceTrimIncr = function(n) {
        if (n === void 0) {
            n = 0;
        }
        var tmp = str.length;
        str = str.slice(n).trimStart();
        offset += tmp - str.length;
    };
    sliceTrimIncr(0);
    if (str.startsWith("integer")) {
        sliceTrimIncr(7);
        return {
            type: UPLCTerms_1.constT.int,
            offset: offset
        };
    }
    if (str.startsWith("bytestring")) {
        sliceTrimIncr(10);
        return {
            type: UPLCTerms_1.constT.byteStr,
            offset: offset
        };
    }
    if (str.startsWith("string")) {
        sliceTrimIncr(6);
        return {
            type: UPLCTerms_1.constT.str,
            offset: offset
        };
    }
    if (str.startsWith("unit")) {
        sliceTrimIncr(4);
        return {
            type: UPLCTerms_1.constT.unit,
            offset: offset
        };
    }
    if (str.startsWith("bool")) {
        if (str.startsWith("boolean")) sliceTrimIncr(7);
        else sliceTrimIncr(4);
        return {
            type: UPLCTerms_1.constT.bool,
            offset: offset
        };
    }
    if (str.startsWith("data")) {
        sliceTrimIncr(4);
        return {
            type: UPLCTerms_1.constT.data,
            offset: offset
        };
    }
    if (str.startsWith("bls12_381_G1_element")) {
        sliceTrimIncr("bls12_381_G1_element".length);
        return {
            type: UPLCTerms_1.constT.bls12_381_G1_element,
            offset: offset
        };
    }
    if (str.startsWith("bls12_381_G2_element")) {
        sliceTrimIncr("bls12_381_G2_element".length);
        return {
            type: UPLCTerms_1.constT.bls12_381_G2_element,
            offset: offset
        };
    }
    if (str.startsWith("bls12_381_MlResult")) throw new Error("bls12_381_MlResult const not supported in textual UPLC");
    if (str.startsWith("(")) {
        sliceTrimIncr(1);
        var listIdx = str.indexOf("list");
        var pairIdx = str.indexOf("pair");
        if (listIdx < 0 && pairIdx < 0) throw new Error("invalid constant type; expected list or pair");
        var isList = isLowestNonNegative(listIdx, pairIdx);
        var isPair = isLowestNonNegative(pairIdx, listIdx);
        if (isList) {
            sliceTrimIncr(listIdx + 4);
            var elems = parseConstType(str);
            sliceTrimIncr(elems.offset);
            while(!str.startsWith(")"))sliceTrimIncr(1);
            sliceTrimIncr(1);
            return {
                type: UPLCTerms_1.constT.listOf(elems.type),
                offset: offset
            };
        } else if (isPair) {
            sliceTrimIncr(pairIdx + 4);
            var fst = parseConstType(str);
            sliceTrimIncr(fst.offset);
            while(str.startsWith(" ") || str.startsWith("\n"))sliceTrimIncr(1);
            var snd = parseConstType(str);
            sliceTrimIncr(snd.offset);
            while(!str.startsWith(")"))sliceTrimIncr(1);
            sliceTrimIncr(1);
            return {
                type: UPLCTerms_1.constT.pairOf(fst.type, snd.type),
                offset: offset
            };
        } else {
            console.log(str, listIdx, pairIdx);
            throw new Error("invalid constant type; missing list or pair");
        }
    }
    throw new Error("unknown UPLC const type; src: " + str);
}
exports.parseConstType = parseConstType;
function parseUPLCText(str, version) {
    if (version === void 0) {
        version = UPLCProgram_1.defaultUplcVersion;
    }
    str = str.trim();
    if (str.startsWith("(program")) {
        str = str.slice(8, str.lastIndexOf(")")).trim();
        var verStr = str.match(/^\d+\.\d+\.\d+(?!\.)/);
        if (!verStr) throw new Error("uplc program without version");
        version = UPLCProgram_1.UPLCVersion.fromString(verStr[0]);
        str = str.slice((0, indexOfMany_1.indexOfMany)(str, "(", "["));
    }
    version = version instanceof UPLCProgram_1.UPLCVersion ? version : UPLCProgram_1.defaultUplcVersion;
    return _parseUPLCText(str, {}, 0, version).term;
}
exports.parseUPLCText = parseUPLCText;
/**
 *
 * @param {string} str string removed of the first opening bracket
 * @example
 * ```ts
 * const str = "( hello )";
 * const expectedInput = str.slice(1); // " hello )";
 * const offset = getOffsetToNextClosingBracket( expectedInput ); // 8
 * ```
 * @returns
 */ function getOffsetToNextClosingBracket(str, openCh, closeCh) {
    if (openCh === void 0) {
        openCh = "(";
    }
    if (closeCh === void 0) {
        closeCh = ")";
    }
    var nBrackets = 1;
    var offset = 0;
    var ch = '';
    while(nBrackets > 0){
        ch = str[offset++];
        if (ch === openCh) {
            nBrackets++;
            continue;
        }
        if (ch === closeCh) {
            nBrackets--;
            continue;
        }
    }
    return offset;
}
exports.getOffsetToNextClosingBracket = getOffsetToNextClosingBracket;
// we have `dataFromString` from "@harmoniclabs/plutus-data"
// but no way to reliably retreive the offset
// seo
function myDataFromStringWithOffset(str) {
    var original = str;
    var openIdx = str.indexOf("(");
    if (openIdx < 0) throw new Error("missign opening wrapping parentesis for data");
    str = str.slice(openIdx + 1);
    var offset = original.length - str.length;
    var closeIdx = (0, indexOfNextUnmatchedParentesis_1.indexOfNextUnmatchedParentesis)(str);
    if (closeIdx < 0) throw new Error("missign closing wrapping parentesis for data");
    offset += closeIdx + 1;
    return {
        data: (0, plutus_data_1.dataFromString)(str.slice(0, closeIdx).trim()),
        offset: offset
    };
}
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/UPLCTerm.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/parseUPLCText.js [app-client] (ecmascript)"), exports);
}),
"[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/interfaces/index.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCDecoder/index.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCEncoder/index.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCProgram/index.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerm/index.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.deno/@harmoniclabs+uplc@1.2.4/node_modules/@harmoniclabs/uplc/dist/UPLCTerms/index.js [app-client] (ecmascript)"), exports);
}),
]);

//# sourceMappingURL=689bf_%40harmoniclabs_uplc_dist_d7390718._.js.map