"use client";

import { ReactElement, useState } from "react";

interface HelloResponse {
    message: string;
}

export default function TestForm(): ReactElement<any, any> {
    const [username, setUsername] = useState("world");
    const [greeting, setGreeting] = useState("");
    const [error, setError] = useState<string | null>(null);

    const fetchGreeting = async () => {
        setError(null); // Clear previous error
        try {
            const response = await fetch(`/api/helloname?username=${username}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data: HelloResponse = await response.json();
            setGreeting(data.message);
        } catch (error: any) {
            setError(error.message);
            console.error("Fetch error: ", error);
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
        </div>
    );
}
