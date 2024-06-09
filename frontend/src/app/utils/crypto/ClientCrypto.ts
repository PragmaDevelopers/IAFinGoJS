import { webcrypto } from "crypto";


async function encryptData(data: string, key: webcrypto.CryptoKey): Promise<{ encryptedData: ArrayBuffer, iv: Uint8Array }> {
    if (!window || !window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API is not available in this environment.');
    }

    const subtle = window.crypto.subtle;

    if (!subtle || typeof subtle.encrypt !== 'function') {
        throw new Error('Subtle crypto operations are not supported in this environment.');
    }

    const encoder = new TextEncoder();
    const iv = generateIV();
    const encryptedData = await subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(data));
    return { encryptedData, iv };
}

function generateIV(): Uint8Array {
    return window.crypto.getRandomValues(new Uint8Array(12));
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return Buffer.from(bytes).toString('base64');
}

export async function encrypt(data: string, key: webcrypto.CryptoKey): Promise<string> {
    try {
        const { encryptedData, iv } = await encryptData(data, key);
        const b64Data = arrayBufferToBase64(encryptedData);
        
        const keyData = await window.crypto.subtle.exportKey('jwk', key);
        const finalDataJSON = {
            data: b64Data,
            iv: Array.from(iv), // Convert Uint8Array to array for JSON
            key: keyData,
        };
        const finalDataString = JSON.stringify(finalDataJSON);
        const finalb64String = Buffer.from(finalDataString).toString('base64');
        return finalb64String.split("").reverse().join("");
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
}

export async function decrypt(data: string): Promise<string> {
    if (!window || !window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API is not available in this environment.');
    }

    const subtle = window.crypto.subtle;

    if (!subtle || typeof subtle.encrypt !== 'function') {
        throw new Error('Subtle crypto operations are not supported in this environment.');
    }

    try {
        const finalb64String = data.split("").reverse().join("");
        const finalDataString = Buffer.from(finalb64String, 'base64').toString('utf-8');
        const jsonObject: { data: string, iv: number[], key: any } = JSON.parse(finalDataString);
        const jsonData = {
            buffer: Uint8Array.from(Buffer.from(jsonObject.data, 'base64')).buffer,
            iv: new Uint8Array(jsonObject.iv),
            key: await window.crypto.subtle.importKey('jwk', jsonObject.key, { name: 'AES-GCM' }, true, ['decrypt']),
        };
        const { buffer, iv, key } = jsonData;
        const decryptedData = await subtle.decrypt({ name: 'AES-GCM', iv }, key, buffer);
        return new TextDecoder().decode(decryptedData);
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
}
