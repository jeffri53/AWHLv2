"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serial = void 0;
const readable_web_to_node_stream_1 = require("readable-web-to-node-stream");
class Serial {
    async close() {
        if (this.reader) {
            const reader = this.reader;
            this.reader = undefined;
            // @ts-ignore
            // this is specific to the "readable-web-to-node-stream" library
            await reader.reader.cancel();
            // await this.reader.close() // this blocks if uploading failed
        }
        if (this.writer) {
            const writer = this.writer;
            this.writer = undefined;
            await writer.close();
        }
        if (this.port) {
            const port = this.port;
            this.port = undefined;
            await port.close();
        }
    }
    async connectWithPaired(options) {
        const [port] = await navigator.serial.getPorts();
        if (!port)
            throw new Error('no paired');
        return this._connect(options, port);
    }
    async connect(options, portFilters = {}) {
        const port = await navigator.serial.requestPort(portFilters);
        return this._connect(options, port);
    }
    async _connect(options, port) {
        options = {
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: 'none',
            bufferSize: 255,
            rtscts: false,
            xon: false,
            xoff: false,
            ...options,
        };
        if (this.port)
            await this.close();
        this.port = port;
        await this.port.open(options);
        this.reader = new readable_web_to_node_stream_1.ReadableWebToNodeStream(this.port.readable);
        this.writer = this.port.writable.getWriter();
        // next I'm faking a NodeJS.ReadWriteStream
        const rwStream = this.reader;
        // @ts-ignore
        rwStream.write = (buffer, onDone) => {
            this.writer.write(buffer).then(() => onDone(null), onDone);
            return true;
        };
        return rwStream;
    }
}
exports.Serial = Serial;
const serial = new Serial();
exports.default = serial;
//# sourceMappingURL=Serial.js.map