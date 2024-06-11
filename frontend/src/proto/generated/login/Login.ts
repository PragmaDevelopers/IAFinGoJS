// Original file: src/proto/login.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { LogInAuthToken as _login_LogInAuthToken, LogInAuthToken__Output as _login_LogInAuthToken__Output } from '../login/LogInAuthToken';
import type { LogInCredentials as _login_LogInCredentials, LogInCredentials__Output as _login_LogInCredentials__Output } from '../login/LogInCredentials';

export interface LoginClient extends grpc.Client {
  Authenticate(argument: _login_LogInCredentials, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_login_LogInAuthToken__Output>): grpc.ClientUnaryCall;
  Authenticate(argument: _login_LogInCredentials, metadata: grpc.Metadata, callback: grpc.requestCallback<_login_LogInAuthToken__Output>): grpc.ClientUnaryCall;
  Authenticate(argument: _login_LogInCredentials, options: grpc.CallOptions, callback: grpc.requestCallback<_login_LogInAuthToken__Output>): grpc.ClientUnaryCall;
  Authenticate(argument: _login_LogInCredentials, callback: grpc.requestCallback<_login_LogInAuthToken__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _login_LogInCredentials, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_login_LogInAuthToken__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _login_LogInCredentials, metadata: grpc.Metadata, callback: grpc.requestCallback<_login_LogInAuthToken__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _login_LogInCredentials, options: grpc.CallOptions, callback: grpc.requestCallback<_login_LogInAuthToken__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _login_LogInCredentials, callback: grpc.requestCallback<_login_LogInAuthToken__Output>): grpc.ClientUnaryCall;
  
}

export interface LoginHandlers extends grpc.UntypedServiceImplementation {
  Authenticate: grpc.handleUnaryCall<_login_LogInCredentials__Output, _login_LogInAuthToken>;
  
}

export interface LoginDefinition extends grpc.ServiceDefinition {
  Authenticate: MethodDefinition<_login_LogInCredentials, _login_LogInAuthToken, _login_LogInCredentials__Output, _login_LogInAuthToken__Output>
}
