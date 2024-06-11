import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { LoginClient as _login_LoginClient, LoginDefinition as _login_LoginDefinition } from './login/Login';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  login: {
    LogInAuthToken: MessageTypeDefinition
    LogInCredentials: MessageTypeDefinition
    Login: SubtypeConstructor<typeof grpc.Client, _login_LoginClient> & { service: _login_LoginDefinition }
  }
}

