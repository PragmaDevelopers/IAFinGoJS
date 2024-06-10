import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// SERVICE
import { ProtoGrpcType as HelloNameServiceProtoGrpcType } from '@/proto/generated/helloname';

const HELLONAME_PROTO_PATH = path.join(process.cwd(), './src/proto/helloname.proto');

const packageDefinition = protoLoader.loadSync(HELLONAME_PROTO_PATH, {
    defaults: true,
    keepCase: true,
    oneofs: true,
});

const helloNameService = (
    grpc.loadPackageDefinition(packageDefinition) as unknown as HelloNameServiceProtoGrpcType
).helloname;

const { HelloService, HelloRequest, HelloResponse } = helloNameService;

export { HelloService, HelloRequest, HelloResponse };