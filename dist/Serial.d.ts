/// <reference types="node" />
export type Port = {
    readable: ReadableStream;
    writable: WritableStream;
    open: (options: SerialOptions) => Promise<void>;
    close: () => Promise<void>;
    getInfo: () => {
        usbProductId: number;
        usbVendorId: number;
    };
};
export type PortFilters = {
    filters?: {
        usbVendorId: number;
        usbProductId: number;
    }[];
};
export type NavigatorSerial = {
    requestPort: (optns: PortFilters) => Port;
    getPorts: () => Promise<Port[]>;
};
export type SerialOptions = {
    baudRate?: number;
    dataBits?: number;
    stopBits?: number;
    parity?: string;
    bufferSize?: number;
    rtscts?: boolean;
    xon?: boolean;
    xoff?: boolean;
    xany?: boolean;
};
declare global {
    interface Window {
        serial: Serial;
    }
    interface Navigator {
        serial: NavigatorSerial;
    }
}
declare global {
    interface Window {
        serial2: Serial;
    }
    interface Navigator {
        serial: NavigatorSerial;
    }
}
export declare class Serial {
    port?: Port;
    reader?: NodeJS.ReadableStream;
    writer?: WritableStreamDefaultWriter;
    close(): Promise<void>;
    connectWithPaired(options: SerialOptions): Promise<NodeJS.ReadWriteStream>;
    connect(options: SerialOptions, portFilters?: PortFilters): Promise<NodeJS.ReadWriteStream>;
    _connect(options: SerialOptions, port: Port): Promise<NodeJS.ReadWriteStream>;
}
declare const serial: Serial;
export default serial;
