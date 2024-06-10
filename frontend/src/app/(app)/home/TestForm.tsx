"use client";

import { encrypt, decrypt } from "@/app/utils/crypto/ClientCrypto";
import { ReactElement, useState } from "react";

interface HelloResponse {
    message: string;
}

export default function TestForm(): ReactElement<any, any> {
    const [username, setUsername] = useState("world");
    const [greeting, setGreeting] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [encryptedData, setEncryptedData] = useState('');
    const [decryptedData, setDecryptedData] = useState('');

    const handleEncrypt = async () => {
        try {
            const encrypted = await encrypt(input); // Assuming key is defined elsewhere
            setEncryptedData(encrypted);
        } catch (error) {
            console.error('Encryption error:', error);
        }
    };

    const handleDecrypt = async () => {
        try {
            const decrypted = await decrypt(encryptedData); // Assuming encryptedData is defined elsewhere
            setDecryptedData(decrypted);
        } catch (error) {
            console.error('Decryption error:', error);
        }
    };


    const fetchGreeting = async () => {
        setError(null); // Clear previous error
        const encrypted = await encrypt(username); // Assuming key is defined elsewhere
        try {
            const response = await fetch(`/api/helloname?username=${encrypted}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data: HelloResponse = await response.json();
            setGreeting(data.message);
        } catch (error: any) {
            setError(error.message);
            console.error("Fetch error: ", error.message);
        }
    };

    return (
        <div>
            <h1>Hello Page</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <p>Greeting: {greeting}</p>
            )}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={fetchGreeting}>Get Greeting</button>
            <div className="my-8 p-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={handleEncrypt}>Encrypt</button>
                <div>
                    <strong>Encrypted Data:</strong> {encryptedData}
                </div>
                <button onClick={handleDecrypt}>Decrypt</button>
                <div>
                    <strong>Decrypted Data:</strong> {decryptedData}
                </div>
            </div>
        </div>
    );
}