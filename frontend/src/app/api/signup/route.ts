import { ChannelCredentials, Client } from "@grpc/grpc-js";
import { Signup } from "@/lib/gRPC/signup";
import { promisify } from "util";
import { SignupClient } from "@/proto/generated/signup/Signup";
import { decrypt } from "@/app/utils/crypto/ServerCrypto";

const getGrpcClient = () => {
    if (process.env.GRPC_SERVER_HOST_NAME === undefined) {
        throw new Error("GRPC_SERVER_HOST_NAME is not set");
    }

    return new Signup(
        `${process.env.GRPC_SERVER_HOST_NAME}:50051`,
        ChannelCredentials.createInsecure()
    );
};

const authenticate = promisify(
    (client: SignupClient, request: { email: string, password: string, firstName: string, lastName: string }, callback: (error: Error | null, response: any) => void) => {
        client.Authenticate(request, callback);
    }
);

export async function POST(request: Request) {
    try {
        const client = getGrpcClient();

        const body = await request.json();
        const email = await decrypt(body.email);
        const password = await decrypt(body.password);
        const firstName = await decrypt(body.firstName);
        const lastName = await decrypt(body.lastName);
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


        const response = await authenticate(client, { email, password, firstName, lastName });

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