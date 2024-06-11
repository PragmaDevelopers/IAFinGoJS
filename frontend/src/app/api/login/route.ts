import { ChannelCredentials, Client } from "@grpc/grpc-js";
import { Login } from "@/lib/gRPC/login";
import { promisify } from "util";
import { LoginClient } from "@/proto/generated/login/Login";
import { decrypt } from "@/app/utils/crypto/ServerCrypto";

const getGrpcClient = () => {
    if (process.env.GRPC_SERVER_HOST_NAME === undefined) {
        throw new Error("GRPC_SERVER_HOST_NAME is not set");
    }

    return new Login(
        `${process.env.GRPC_SERVER_HOST_NAME}:50051`,
        ChannelCredentials.createInsecure()
    );
};

const authenticate = promisify(
    (client: LoginClient, request: { email: string, password: string }, callback: (error: Error | null, response: any) => void) => {
        client.Authenticate(request, callback);
    }
);

export async function POST(request: Request) {
    try {
        const client = getGrpcClient();

        const body = await request.json();
        const email = await decrypt(body.email);
        const password = await decrypt(body.password);
        const reCaptchaToken = body.reCaptchaToken;
        const verifyResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `secret=${process.env.SECRET_KEY}&response=${reCaptchaToken}`
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResult.success || verifyResult.score < 0.5) {
            return new Response(JSON.stringify({ success: false, message: 'ReCAPTCHA verification failed' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            }) 
        }

        const response = await authenticate(client, { email, password });

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("gRPC call failed:", error);
        return new Response(JSON.stringify({ error: "Request has failed, check server logs!" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}