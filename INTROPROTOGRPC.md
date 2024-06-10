# Introdução aos Protocol Buffers 3 e o gRPC.

Em termos simples, Protocol Buffers (ProtoBufs) são o protocolo usado na comunicação, enquanto o gRPC é a forma que os dados são transmitidos.

Pense como HTTP/REST, HTTP é o protocolo, a organização dos dados e metodos é a REST.

ok, vamos começar explicando como ProtoBufs funcionam, e como você pode escrever o seu, para simplificar irei usar somente os exemplos de Go e TypeScript por serem o escopo deste projeto.

Um formato de ProtoBuf é um arquivo terminado em `.proto` que contém algumas informações, irei mostrar um arquivo completo e explicar passo-a-passo seus elementos.

```protobuf
syntax = "proto3";
package login;
import "baseAuth.proto";
option go_package = "api/proto";

message Login = {
    string firstname = 1;
    string lastname = 2;
    message emails = {
        string firstemail = 1;
        string secondemail = 2;
    }
    Gender gender = 3;
    string password = 4;
    baseAuth.RecaptchaID id = 5;
}

enum Gender {
    MALE = 0;
    FEMALE = 1;
    UNDEFINED = 2;
}

message Token = {
    string authToken = 1;
}

service Auth {
    rpc Authenticate (Login) returns (Token);
}
```

as primeiras linhas definem alguns metadados do formato.

- `syntax = "proto3";` define que estamos usando a sintaxe da versão 3, e não da versão 2.
- `package login;` é o nome do pacote para não haver conflito de nomes, e pra distinção também.
- `import "baseAuth.proto";` exemplo de um import de arquivo externo.
- `option go_package = "api/proto";` aqui definimos uma opção customizada chamada go\_package que é usada pelo compilador de protobuf->go como caminho para colocar os arquivos gerados.