import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { HelloServiceClient as _helloname_HelloServiceClient, HelloServiceDefinition as _helloname_HelloServiceDefinition } from './helloname/HelloService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  helloname: {
    HelloRequest: MessageTypeDefinition
    HelloResponse: MessageTypeDefinition
    HelloService: SubtypeConstructor<typeof grpc.Client, _helloname_HelloServiceClient> & { service: _helloname_HelloServiceDefinition }
  }
}

