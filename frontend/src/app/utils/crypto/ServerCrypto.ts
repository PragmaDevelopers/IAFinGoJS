import * as crypto from "crypto";

async function encryptData(data: string, key: crypto.webcrypto.CryptoKey): Promise<{ encryptedData: ArrayBuffer, iv: Uint8Array }> {
    const subtle = crypto.subtle;

    const encoder = new TextEncoder();
    const iv = generateIV();
    const encryptedData = await subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(data));
    return { encryptedData, iv };
}

function generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(12));
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return Buffer.from(bytes).toString('base64');
}

async function _encrypt(data: string, key: crypto.webcrypto.CryptoKey): Promise<string> {
    try {
        const { encryptedData, iv } = await encryptData(data, key);
        const b64Data = arrayBufferToBase64(encryptedData);
        const keyData = await crypto.subtle.exportKey('jwk', key);
        const finalDataJSON = {
            data: b64Data,
            iv: Array.from(iv),
            key: keyData,
        }

        const finalDataString = JSON.stringify(finalDataJSON);
        const finalb64String = Buffer.from(finalDataString).toString("base64");
        return finalb64String.split("").reverse().join("");
    } catch (e) {
        console.error("Encryption error", e);
        throw e;
    }
}

export async function encrypt(data: string): Promise<string> {
    const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const result: string = await _encrypt(data, key);
    return result;
}

export async function decrypt(data: string): Promise<string> {
    try {
        const finalb64String = (data as string).split("").reverse().join("");
        const finalDataString = Buffer.from(finalb64String, 'base64').toString('utf-8');
        const jsonObject: { data: string, iv: number[], key: any } = JSON.parse(finalDataString);
        const jsonData = {
            buffer: Uint8Array.from(Buffer.from(jsonObject.data, 'base64')).buffer,
            iv: new Uint8Array(jsonObject.iv),
            key: await crypto.subtle.importKey('jwk', jsonObject.key, { name: 'AES-GCM' }, true, ['decrypt']),
        };
        const { buffer, iv, key } = jsonData;
        const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, buffer);
        return new TextDecoder().decode(decryptedData);
    } catch (e) {
        console.error("Decryption error", e);
        throw e;
    }
}