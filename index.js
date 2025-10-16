"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.boards = void 0;
const Serial_1 = __importDefault(require("./Serial"));
const async_1 = __importDefault(require("async"));
const intel_hex = __importStar(require("intel-hex"));
const stk500_1 = __importDefault(require("stk500"));
const { version } = require('../package.json');
exports.boards = {
    avr4809: {
        signature: Buffer.from([0x1e, 0x96, 0x51]),
        pageSize: 128,
        timeout: 400,
        baudRate: 115200,
        use_8_bit_addresseses: true,
    },
    lgt8f328p: {
        signature: Buffer.from([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        timeout: 400,
        baudRate: 57600,
    },
    nanoOldBootloader: {
        signature: Buffer.from([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        timeout: 400,
        baudRate: 57600,
    },
    nano: {
        signature: Buffer.from([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        timeout: 400,
        baudRate: 115200,
    },
    uno: {
        signature: Buffer.from([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        timeout: 400,
        baudRate: 115200,
    },
    proMini: {
        signature: Buffer.from([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        timeout: 400,
        baudRate: 115200,
    },
};
const noop = (callback) => callback();
console.log("Arduino Web Uploader Version:", version);
async function upload(board, hexFileHref, onProgress, verify = false, portFilters = {}) {
    try {
        const text = await fetch(hexFileHref)
            .then((response) => response.text());
        let { data: hex } = intel_hex.parse(text);
        const serialStream = await Serial_1.default.connect({ baudRate: board.baudRate }, portFilters);
        onProgress(0);
        const stk500 = new stk500_1.default();
        let sent = 0;
        let total = hex.length / board.pageSize;
        if (verify)
            total *= 2;
        stk500.log = (what) => {
            if (what === 'page done' || what === 'verify done') {
                sent += 1;
                const percent = Math.round((100 * sent) / total);
                onProgress(percent);
            }
            console.log(what, sent, total, hex.length, board.pageSize);
        };
        await async_1.default.series([
            // send two dummy syncs like avrdude does
            stk500.sync.bind(stk500, serialStream, 3, board.timeout),
            stk500.sync.bind(stk500, serialStream, 3, board.timeout),
            stk500.sync.bind(stk500, serialStream, 3, board.timeout),
            stk500.verifySignature.bind(stk500, serialStream, board.signature, board.timeout),
            stk500.setOptions.bind(stk500, serialStream, {}, board.timeout),
            stk500.enterProgrammingMode.bind(stk500, serialStream, board.timeout),
            stk500.upload.bind(stk500, serialStream, hex, board.pageSize, board.timeout, board.use_8_bit_addresseses),
            !verify ? noop : stk500.verify.bind(stk500, serialStream, hex, board.pageSize, board.timeout, board.use_8_bit_addresseses),
            stk500.exitProgrammingMode.bind(stk500, serialStream, board.timeout),
        ]);
    }
    finally {
        Serial_1.default.close();
    }
}
exports.upload = upload;
exports.default = upload;
//# sourceMappingURL=index.js.map