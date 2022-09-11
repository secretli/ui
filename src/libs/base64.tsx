import {decode, encode, trim} from "url-safe-base64";

class Base64 {
    public static encode(buffer: ArrayBuffer): string {
        let array = new Uint8Array(buffer)
        let numbers = Array.from(array)
        let bytes = String.fromCharCode.apply(null, numbers)
        let encoded = btoa(bytes)
        let safeEncoded = encode(encoded)
        return trim(safeEncoded)
    }

    public static decode(safeEncoded: string): ArrayBuffer {
        let encoded = decode(safeEncoded)
        let decoded = atob(encoded)
        let bytes = decoded.split('').map(c => c.charCodeAt(0))
        return new Uint8Array(bytes)
    }
}

export default Base64;
