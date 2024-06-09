import { ChannelCredentials, Client } from "@grpc/grpc-js";
import { HelloService } from "@/lib/grpc";
import { promisify } from "util";
import { HelloServiceClient } from "@/proto/generated/helloname/HelloService";

const getGrpcClient = () => {
    if (process.env.GRPC_SERVER_HOST_NAME === undefined) {
        throw new Error("GRPC_SERVER_HOST_NAME is not set");
    }

    return new HelloService(
        `${process.env.GRPC_SERVER_HOST_NAME}:50051`,
        ChannelCredentials.createInsecure()
    );
};

const sayHelloAsync = promisify(
    (client: HelloServiceClient, request: { username: string }, callback: (error: Error | null, response: any) => void) => {
        client.sayHello(request, callback);
    }
);

export async function GET(request: Request) {
    try {
        const client = getGrpcClient();

        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username") || "world";

        const response = await sayHelloAsync(client, { username });

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
