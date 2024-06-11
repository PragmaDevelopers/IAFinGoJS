// Original file: src/proto/signup.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { SignUpAuthToken as _signup_SignUpAuthToken, SignUpAuthToken__Output as _signup_SignUpAuthToken__Output } from '../signup/SignUpAuthToken';
import type { SignUpCredentials as _signup_SignUpCredentials, SignUpCredentials__Output as _signup_SignUpCredentials__Output } from '../signup/SignUpCredentials';

export interface SignupClient extends grpc.Client {
  Authenticate(argument: _signup_SignUpCredentials, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_signup_SignUpAuthToken__Output>): grpc.ClientUnaryCall;
  Authenticate(argument: _signup_SignUpCredentials, metadata: grpc.Metadata, callback: grpc.requestCallback<_signup_SignUpAuthToken__Output>): grpc.ClientUnaryCall;
  Authenticate(argument: _signup_SignUpCredentials, options: grpc.CallOptions, callback: grpc.requestCallback<_signup_SignUpAuthToken__Output>): grpc.ClientUnaryCall;
  Authenticate(argument: _signup_SignUpCredentials, callback: grpc.requestCallback<_signup_SignUpAuthToken__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _signup_SignUpCredentials, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_signup_SignUpAuthToken__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _signup_SignUpCredentials, metadata: grpc.Metadata, callback: grpc.requestCallback<_signup_SignUpAuthToken__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _signup_SignUpCredentials, options: grpc.CallOptions, callback: grpc.requestCallback<_signup_SignUpAuthToken__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _signup_SignUpCredentials, callback: grpc.requestCallback<_signup_SignUpAuthToken__Output>): grpc.ClientUnaryCall;
  
}

export interface SignupHandlers extends grpc.UntypedServiceImplementation {
  Authenticate: grpc.handleUnaryCall<_signup_SignUpCredentials__Output, _signup_SignUpAuthToken>;
  
}

export interface SignupDefinition extends grpc.ServiceDefinition {
  Authenticate: MethodDefinition<_signup_SignUpCredentials, _signup_SignUpAuthToken, _signup_SignUpCredentials__Output, _signup_SignUpAuthToken__Output>
}
