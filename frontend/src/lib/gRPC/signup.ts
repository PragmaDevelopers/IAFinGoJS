import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// SERVICE
import { ProtoGrpcType as SignupServiceProtoGrpcType } from '@/proto/generated/signup';

const SIGNUP_PROTO_PATH = path.join(process.cwd(), './src/proto/signup.proto');

const packageDefinition = protoLoader.loadSync(SIGNUP_PROTO_PATH, {
    defaults: true,
    keepCase: true,
    oneofs: true,
});

const LoginService = (
    grpc.loadPackageDefinition(packageDefinition) as unknown as SignupServiceProtoGrpcType
).signup;

const { SignUpAuthToken, SignUpCredentials, Signup } = LoginService;

export { SignUpAuthToken, SignUpCredentials, Signup };