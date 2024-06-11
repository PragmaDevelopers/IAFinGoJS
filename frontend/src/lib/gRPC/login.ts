import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// SERVICE
import { ProtoGrpcType as LoginServiceProtoGrpcType } from '@/proto/generated/login';

const LOGIN_PROTO_PATH = path.join(process.cwd(), './src/proto/login.proto');

const packageDefinition = protoLoader.loadSync(LOGIN_PROTO_PATH, {
    defaults: true,
    keepCase: true,
    oneofs: true,
});

const LoginService = (
    grpc.loadPackageDefinition(packageDefinition) as unknown as LoginServiceProtoGrpcType
).login;

const { LogInAuthToken, LogInCredentials, Login } = LoginService;

export { LogInAuthToken, LogInCredentials, Login };