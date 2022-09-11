import Base64 from "./base64";

export class KeySet {
    private readonly shareSecret: ArrayBuffer;
    private readonly shareKey: ArrayBuffer;
    private readonly publicID: ArrayBuffer;
    private readonly retrievalToken: ArrayBuffer;
    private readonly deletionToken: ArrayBuffer;

    private constructor(
        shareSecret: ArrayBuffer,
        shareKey: ArrayBuffer,
        publicID: ArrayBuffer,
        retrievalToken: ArrayBuffer,
        deletionToken: ArrayBuffer
    ) {
        this.shareSecret = shareSecret
        this.shareKey = shareKey
        this.publicID = publicID
        this.retrievalToken = retrievalToken
        this.deletionToken = deletionToken
    }

    public static NewRandomKeySet = async () => {
        let keyBytes = generateRandomBytes(32)
        return KeySet.deriveKeySet(keyBytes)
    }

    public static KeySetFromString = async (encodedKey: string) => {
        let keyBytes = Base64.decode(encodedKey)
        return KeySet.deriveKeySet(keyBytes)
    }

    public getEncodedKeySet(): EncodedKeySet {
        return {
            shareSecret: Base64.encode(this.shareSecret),
            publicID: Base64.encode(this.publicID),
            retrievalToken: Base64.encode(this.retrievalToken),
            deletionToken: Base64.encode(this.deletionToken),
        }
    }

    public async encrypt(msg: string): Promise<EncryptedData> {
        // deepcode ignore HardcodedSecret: Actually not a secret but just the length of a securely generated nonce.
        let nonce = generateRandomBytes(12)
        let encodedMessage = new TextEncoder().encode(msg)

        let key = await crypto.subtle.importKey('raw', this.shareKey, 'AES-GCM', false, ['encrypt'])
        let encrypted = await crypto.subtle.encrypt({name: 'AES-GCM', iv: nonce}, key, encodedMessage);

        return {
            nonce: Base64.encode(nonce),
            encrypted_data: Base64.encode(encrypted)
        }
    }

    public async decrypt(encrypted: EncryptedData): Promise<string> {
        let nonce = Base64.decode(encrypted.nonce)
        let cipher = Base64.decode(encrypted.encrypted_data)

        let key = await crypto.subtle.importKey('raw', this.shareKey, 'AES-GCM', false, ['decrypt'])
        let decrypted = await crypto.subtle.decrypt({name: 'AES-GCM', iv: nonce}, key, cipher)

        return new TextDecoder().decode(decrypted)
    }

    private static deriveKeySet = async (keyBytes: ArrayBuffer) => {
        let key = await crypto.subtle.importKey('raw', keyBytes, 'HKDF', false, ['deriveBits'])

        const shareSecret = keyBytes
        const shareKey = await KeySet.deriveSubkey(key, "share_item_encryption_key", 32)
        const publicID = await KeySet.deriveSubkey(key, "share_item_uuid", 16)
        const retrievalToken = await KeySet.deriveSubkey(key, "share_item_token", 16)
        const deletionToken = generateRandomBytes(16)

        return new KeySet(shareSecret, shareKey, publicID, retrievalToken, deletionToken)
    }

    private static async deriveSubkey(key: CryptoKey, info: string, length: number): Promise<ArrayBuffer> {
        let infoBytes = new TextEncoder().encode(info)
        let saltBytes = new Uint8Array(0)
        let params: HkdfParams = {name: 'HKDF', hash: 'SHA-512', info: infoBytes, salt: saltBytes}
        return crypto.subtle.deriveBits(params, key, length * 8)
    }
}

export interface EncodedKeySet {
    readonly shareSecret: string,
    readonly publicID: string,
    readonly retrievalToken: string,
    readonly deletionToken: string,
}

export interface EncryptedData {
    readonly nonce: string,
    readonly encrypted_data: string
}

function generateRandomBytes(n: number): ArrayBuffer {
    let data = new Uint8Array(n)
    crypto.getRandomValues(data)
    return data
}
