import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { SignupClient as _signup_SignupClient, SignupDefinition as _signup_SignupDefinition } from './signup/Signup';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  signup: {
    SignUpAuthToken: MessageTypeDefinition
    SignUpCredentials: MessageTypeDefinition
    Signup: SubtypeConstructor<typeof grpc.Client, _signup_SignupClient> & { service: _signup_SignupDefinition }
  }
}

