// Original file: src/proto/helloname.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { HelloRequest as _helloname_HelloRequest, HelloRequest__Output as _helloname_HelloRequest__Output } from '../helloname/HelloRequest';
import type { HelloResponse as _helloname_HelloResponse, HelloResponse__Output as _helloname_HelloResponse__Output } from '../helloname/HelloResponse';

export interface HelloServiceClient extends grpc.Client {
  SayHello(argument: _helloname_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_helloname_HelloResponse__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _helloname_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_helloname_HelloResponse__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _helloname_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_helloname_HelloResponse__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _helloname_HelloRequest, callback: grpc.requestCallback<_helloname_HelloResponse__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _helloname_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_helloname_HelloResponse__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _helloname_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_helloname_HelloResponse__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _helloname_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_helloname_HelloResponse__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _helloname_HelloRequest, callback: grpc.requestCallback<_helloname_HelloResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface HelloServiceHandlers extends grpc.UntypedServiceImplementation {
  SayHello: grpc.handleUnaryCall<_helloname_HelloRequest__Output, _helloname_HelloResponse>;
  
}

export interface HelloServiceDefinition extends grpc.ServiceDefinition {
  SayHello: MethodDefinition<_helloname_HelloRequest, _helloname_HelloResponse, _helloname_HelloRequest__Output, _helloname_HelloResponse__Output>
}
