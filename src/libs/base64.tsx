import { decode, encode, trim } from "url-safe-base64";

class Base64 {
  public static encode(buffer: ArrayBuffer): string {
    const array = new Uint8Array(buffer);
    const numbers = Array.from(array);
    const bytes = String.fromCharCode.apply(null, numbers);
    const encoded = btoa(bytes);
    const safeEncoded = encode(encoded);
    return trim(safeEncoded);
  }

  public static decode(safeEncoded: string): ArrayBuffer {
    const encoded = decode(safeEncoded);
    const decoded = atob(encoded);
    const bytes = decoded.split("").map((c) => c.charCodeAt(0));
    return new Uint8Array(bytes);
  }
}

export default Base64;
