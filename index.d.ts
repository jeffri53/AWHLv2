/// <reference types="node" />
import { PortFilters } from './Serial';
declare type Board = {
    signature: Buffer;
    pageSize: number;
    timeout: number;
    baudRate: number;
    use_8_bit_addresseses?: boolean;
};
export declare const boards: {
    avr4809: Board;
    lgt8f328p: Board;
    nanoOldBootloader: Board;
    nano: Board;
    uno: Board;
    proMini: Board;
};
export declare function upload(board: Board, hexFileHref: string, onProgress: (percentage: number) => void, verify?: boolean, portFilters?: PortFilters): Promise<void>;
export default upload;
