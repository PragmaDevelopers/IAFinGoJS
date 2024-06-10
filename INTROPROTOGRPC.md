# Introdução aos Protocol Buffers 3 e o gRPC.

Em termos simples, Protocol Buffers (ProtoBufs) são o protocolo usado na comunicação, enquanto o gRPC é a forma que os dados são transmitidos.

Pense como HTTP/REST, HTTP é o protocolo, a organização dos dados e metodos é a REST.

## Estrutura de um protocolo.

ok, vamos começar explicando como ProtoBufs funcionam, e como você pode escrever o seu, para simplificar irei usar somente os exemplos de Go e TypeScript por serem o escopo deste projeto.

Um formato de ProtoBuf é um arquivo terminado em `.proto` que contém algumas informações, irei mostrar um arquivo completo e explicar passo-a-passo seus elementos.

> AVISO: a partir deste ponto, toda vez que eu me referir a palavra **`PROTOCOLO`**, eu também poderei estar me referindo ao arquivo `.proto`


```protobuf
syntax = "proto3";
package login;
import "baseAuth.proto";
option go_package = "api/proto";

message Login {
    Names names = 1;
    message Emails {
        string firstemail = 1;
        string secondemail = 2;
    }
    Emails emails = 2;
    Gender gender = 3;
    string password = 4;
    baseAuth.RecaptchaID id = 5;
}

message Names {
    string firstname = 1;
    string lastname = 2;
}

enum Gender {
    MALE = 0;
    FEMALE = 1;
    UNDEFINED = 2;
}

message Token {
    string authToken = 1;
}

service Auth {
    rpc Authenticate (Login) returns (Token);
}
```

as primeiras linhas definem alguns metadados do formato:

- `syntax = "proto3";` define que estamos usando a sintaxe da versão 3, e não da versão 2.

- `package login;` é o nome do pacote para não haver conflito de nomes, e pra distinção também.

- `import "baseAuth.proto";` exemplo de um import de arquivo externo.

- `option go_package = "api/proto";` aqui definimos uma opção customizada chamada go\_package que é usada pelo compilador de protobuf->go como caminho para colocar os arquivos gerados.

as outras linhas são referentes ao gRPC e ao ProtoBuffer em si, então primeiro vamos entender a estrutura mais basica de um protobuffer, as mensagens.

uma mensagem é um agrupamento de dados primitivos (escalares) que definem a estrutura do dado que queremos transmitir.

os dados internos seguem a estrutura de: `<TIPO> <ATRIBUTO> = <ID UNICO>;`

existem varios tipos de dados que podem ser usados em um atributo, favor olhar os [Tipos Escalares](https://protobuf.dev/programming-guides/proto3/#scalar).

vamos dar uma olhada na mensagem mais simples que temos, o nosso Token.

```protobuf
message Token = {
    string authToken = 1;
}
```

nós definimos a estrutura com a keyword `message`, seguido por chaves e uma sequência de um ou mais dados internos.

Neste exemplo como nós só temos um unico valor, seu ID unico é apenas `1`.

antes de seguirmos preciso explicar _em detalhes_ os IDs unicos, eles são primordias na [codificação de protobuffers](https://protobuf.dev/programming-guides/encoding).

### IDs Unicos

Os IDs são responsaveis pelo tamanho e distinção dos campos no formato WIRE (o formato primitivo de comunicação dos protobufs), então não podem existir errors na definição de um ID, mas eles são simples então se acalme.

basicamente IDs são quaisquer numero entre `1` e `536,870,911`.

mas existem algumas restições:

- Eles devem ser UNICOS, entre todos os outros campos da _mensagem_.

- os numeros entre `19,000` e `19,999` são reservados, eles são usados pela implementação interna dos protobuffers, e caso você tente usa-los o compilador irá reclamar.

- você não pode re-ultilizar nenhum ID previamente usado na mensagem, IDs reservados ou usados em extensões. (extensões por enquanto só existem em ProtoBuffers 2, então não vou explica-las aqui.)

perceba que eu frisei bem que as restrições de singularidade são references a MENSAGEM, não ao protocolo.

isso é porquê o nome da mensagem, junto com o nome do pacote também são usados para identificação, irei mostrar alguns exemplos de CORRETO e ERRADO.

**CORRETO:**
```protobuf
syntax = "proto3";
package Exemplo1;

message Exemplo {
    string texto = 1;
}

message Exemplo2 {
    string texto = 1;
}
```

```protobuf
syntax = "proto3";
package Exemplo2;

message Exemplo {
    string texto = 1;
}
```

**CORRETO:**
```protobuf
syntax = "proto3";
package Exemplo1;

message Exemplo {
    string texto = 1;
}

message Exemplo2 {
    string texto = 1;
}
```

**CORRETO:**
```protobuf
syntax = "proto3";
package Exemplo1;

message Exemplo {
    string texto = 1;
}
```

**ERRADO:**
```protobuf
syntax = "proto3";
package Exemplo1;

message Exemplo {
    string texto = 1;
}

message Exemplo {
    string texto = 1;
}
```

> Aqui definimos duas mensagens com mesmo nome no mesmo pacote, o que é invalido. 

**ERRADO:**
```protobuf
syntax = "proto3";
package Exemplo1;

message Exemplo {
    string texto = 1;
    string texto2 = 1;
}
```

> Aqui definimos dois campos com o mesmo ID na mesma mensagem, o que é invalido. 

**ERRADO:**
```protobuf
syntax = "proto3";
package Exemplo1;

message Exemplo {
    reserved 2, 3, 4, 5 to 12;
    string texto = 3;
}
```

> Aqui definimos um campo com um ID que foi marcado como reservado, o que é inválido.

Bom, espero que tenham entendido. Agora vamos a uma pequena recomendação:

A documentação dos protobufs diz o seguinte:

> You should use the field numbers 1 through 15 for the most-frequently-set fields. Lower field number values take less space in the WIRE format. For example, field numbers in the range 1 through 15 take one byte to encode. Field numbers in the range 16 through 2047 take two bytes

Traduzindo, basicamente ela diz para estruturarmos nossas mensagens de modo a usarmos os numeros entre 1 e 15 para os dados mais frequentes, porque numeros menores ocupam menos espaço na codifação do formato WIRE. Por exemplo, os numeros de 1 a 15 usam 1 byte e os numeros 16 até 2047 usam dois bytes.

então tendo isso em vista, tentem organizar as mensagens de tal modo a usarem os numeros de 1 até 15, ou caso necessário, apenas que os dados mais importantes fiquem nesse espectro.

---

Voltando a estrutura dos protocolos, nós podemos colocar mensagens dentro de mensagens para criar campos compostos:

```protobuf
message Login {
    Names names = 1;
    message Emails {
        string firstemail = 1;
        string secondemail = 2;
    }
    Emails emails = 2;
    Gender gender = 3;
    string password = 4;
    baseAuth.RecaptchaID id = 5;
}

message Names {
    string firstname = 1;
    string lastname = 2;
}
```

aqui criamos a mensagem Emails que contém dois campos do tipo string, essa mensagem é então usada para criar o campo email na mensagem Login.

nos protocolos existe escopo, então a mensagem Emails é disponivel somente no contexto interno da mensagem Login, não sendo possivel usa-lá em outra mensagem fora da mensagem Login.

para reutilizarmos mensagens em declarações de outras mensagens precisamos defini-las no escopo do arquivo, da forma como a mensagem `Names` foi definida e então usada.

assim como em C e outras linguagens, protobuffers tem ENUMS, e elas funcionam da mesma forma:

```protobuf
enum Gender {
    MALE = 0;
    FEMALE = 1;
    UNDEFINED = 2;
}
```

qualquer campo do tipo Gender pode conter um destes valores.

### Serviços

Um serviço define um flow de informação (dados), através do protocolo, e existem 4 tipos:

- Unário: Recebe uma mensagem e envia uma mensagem.

- Transmissão do Cliente (Receiver Stub): Recebe uma transmissão e envia uma mensagem.

- Transmissão do Server (Sender Stub): Recebe uma mensagem e envia uma transmissão.

- Transmissão Bidirecional: Recebe uma transmissão e envia uma mensagem.

um serviço é uma definição/criação do gRPC, e não dos protobuffers, ele tem a seguinte estrutura:

```protobuf
service Auth {
    // RPC Unario
    rpc Authenticate (Login) returns (Token);
    
    // Transmissão do Server RPC
    rpc StreamMessages (Login) returns (stream Message);
    
    // Transmissão do Cliente RPC
    rpc UploadLogs (stream Message) returns (Status);
    
    // Transmissão RPC Bidirecional
    rpc Chat (stream Message) returns (stream Message);
}
```

nós definimos um serviço com um nome, e fluxos de dado RPC com nomes, que recebem uma mensagem, ou uma stream de uma dada mensagem, e retornam outra mensagem ou uma stream de uma dada outra mensagem.

> Nós podemos escrever comentários nos protocolos usando // ou /**/ como em C.

quando nós temos uma transmissão em quaisquer uma das pontas, significa que o cliente e/ou o server irão enviar várias sequencias de mensagens, enquanto o outro lado pode optar por encerrar a conexão, receber todas as mensagens, ou responder de forma progressiva (no caso de transmissões bidirecionais).

você pode ler mais em [gRPC Core Concepts](https://grpc.io/docs/what-is-grpc/core-concepts/).

> Vale ressaltar que o gRPC certifica a ordenação das mensagens, então não precisamos nos preocupar com as mensagens/transmissões chegando embaralhadas.

agora vamos a outro tópico importante antes de seguirmos para as implementações nas linguagens.

## Removendo campos

Lembra quando eu disse que os IDs devem ser unicos dentro a mensagem? bom, e o que acontece quando você deleta um campo ou edita um numero?

Resposta curta: problemas.

Resposta Longa:

quando nós já temos um servidor RPC estabelecido e fazemos mudanças na estrutura dos protocolos, devido a codificação WIRE, o ID e nome do campo são usados em identificação e transmissão e portanto são registrados no protocolo, então mudar um nome pode gerar inconsistencia de informação ou corrupção de dados pois o que está registrado no protocolo é diferente do que está sendo transmitido; e por isso é recomendado que se evite editar ou remover informações no protocolo de forma **INADEQUADA.** Então você deve se perguntar, 

*"Qual a forma adequada?"*

Resposta: através da reserva de ID e campos.

os protobuffers tem uma keyword chamada `reserved` que serve para reservar nome de campos e IDs dentro daquela mensagem, então toda vez que você fizer uma mudança em uma mensagem que já esteja em execução no servidor RPC, reserve os nomes dos campos e seus IDs.

aqui vai um exemplo:

```protobuf
message Mensagem {
    reserved 1, 2, 3, 4, 5 to 10;
    reserved "foo", "bar", "test";
}
```

nessa mensagem nós reservarmos os IDs: 1, 2, 3, 4, 5 até o 10;

e os nomes de campos "foo", "bar", "test".

> vale ressaltar que a keyword de area **`to`** é inclusiva, ou seja, significa 5 até 10, resultando em [5, 6, 7, 8, 9, 10];

quando nós temos campos e IDs reservados, caso alguém tente usar um desses campos ou IDs o compilador dos protobuffers irá reclamar e avisar.


## Trabalhando com Go

> Spoiler, é bem mais facil que TypeScript.

você compila os arquivos `.proto`, importa eles no codigo, define as estruturas e funções, registra no servidor rpc e pronto. Mas vamos a um guia.

vamos usar como exemplo o seguinte protocolo:

```protobuf
syntax = "proto3";

package helloname;

option go_package = "api/proto";

service HelloService {
    rpc SayHello (HelloRequest) returns (HelloResponse);
}

message HelloRequest {
    string username = 1;
}

message HelloResponse {
    string message = 1;
}
```

no exemplo desse projeto, você pode navegar para a pasta `backend/`, colocar seus arquivos .proto nela, e rodar o seguinte comando dentro da pasta `backend/`

`protoc --go_out=. --go-grpc_out=. ./proto_files/*.proto`

esse comando vai automaticamente compilar todos os arquivos .proto nessa pasta e colocalos no local especificado na opção `go_package`, no nosso caso, `api/proto`.

ok, agora nós temos dois arquivos dentro da pasta api/proto, o que fazemos?

a primeira coisa a ser feita é criar um servidor tcp em Go para servir o gRPC.

```go
package api

import (
    "context"
    "fmt"
    "log"
    "net"

    "google.golang.org/grpc"
)


func Server() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    s := grpc.NewServer()
    log.Printf("server listening at %v", lis.Addr())
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}

```

depois o proximo passo é importar os arquivos criados, (eu criei um modulo na pasta para facilitar)

```go
import (
    "context"
    "fmt"
    "log"
    "net"

    "google.golang.org/grpc"

    pb "api/proto" // os arquivos criados estão aqui.
)
```

depois nós criamos uma struct que implementa o serviço que queremos registrar no servidor RPC:

```go
// o nome do tipo é arbitrário, pode ser qualquer coisa
type server struct { 
    pb.UnimplementedHelloServiceServer
}
```

por fim, implementamos o metodo definido no arquivo .proto, no nosso caso, uma função SayHello que recebe um HelloRequest e envia um HelloResponse:

```go
func (s *server) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloResponse, error) {
    message := fmt.Sprintf("Hello, %s!", req.Username)
    return &pb.HelloResponse{Message: message}, nil
}
```

a função precisa receber um context.Context, depois o tipo de dado definido no arquivo .proto, e deve sempre retornar um erro, mesmo que nulo.

e por ultimo nós só precisamos registrar o serviço:

```go
pb.RegisterHelloServiceServer(s, &server{})
```

resultando no seguinte código:

```go
package api

import (
    "context"
    "fmt"
    "log"
    "net"

    "google.golang.org/grpc"
    pb "api/proto"
)

type server struct {
    pb.UnimplementedHelloServiceServer
}

func (s *server) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloResponse, error) {
    message := fmt.Sprintf("Hello, %s!", req.Username)
    return &pb.HelloResponse{Message: message}, nil
}

func Server() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    s := grpc.NewServer()
    
    pb.RegisterHelloServiceServer(s, &server{})

    log.Printf("server listening at %v", lis.Addr())
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
```

pronto, agora você tem um servidor gRCP pronto para ser usado!

vale ressaltar que os arquivos compilados pelo `protoc` contém todas as definições do arquivo `.proto`, então você pode usar para criar variaveis do tipo `HelloRequest` por exemplo.

*"e se eu tiver mais de um serviço?"* você deve se perguntar, bom é simples, basta repetir os passos 2 até o ultimo:

- importar
- definir
- registrar
- usar

caso eles estejam dentro de `api/proto`, eles já são automaticamente importados pelo modulo, basta definir e registrar, simples.

## Trabalhando com TypeScript

> Spoiler, é onde o filho chora e a mãe não vê.

durante essa explicação estaremos usando o seguinte exemplo de protocolo:

```protobuf
syntax = "proto3";

package helloname;

option go_package = "api/proto";

service HelloService {
    rpc SayHello (HelloRequest) returns (HelloResponse);
}

message HelloRequest {
    string username = 1;
}

message HelloResponse {
    string message = 1;
}
```

primeira coisa que você deve fazer é instalar os pacotes do npm com `npm install`.

depois colocar qualquer arquivo `.proto` na pasta `proto/` e rodar o comando `npm run proto-gen-types` dentro da pasta `frontend/`.

você verá uma nova pasta chamada `generated`, que vai conter um arquivo.ts e uma pasta com o mesmo nome do arquivo, esses são nossos serviços e mensagens compilados.

para usa-los basta criar um arquivo .ts contendo a estrutura para carregar o arquivo proto, vou dar um exemplo completo e depois explica-lo:

```typescript
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
```

nós começamos importando os itens necessários para o carregamento das definições do pacote proto.

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
```

depois nós carregamos as definições de pacote usando o protoloader:

```typescript
const HELLONAME_PROTO_PATH = path.join(process.cwd(), './src/proto/helloname.proto');

const packageDefinition = protoLoader.loadSync(HELLONAME_PROTO_PATH, {
    defaults: true,
    keepCase: true,
    oneofs: true,
});
```

e por ultimo nós carregamos o pacote que nós definimos, e exportamos os seus membros:

```typescript
const helloNameService = (
    grpc.loadPackageDefinition(packageDefinition) as unknown as HelloNameServiceProtoGrpcType
).helloname;

const { HelloService, HelloRequest, HelloResponse } = helloNameService;

export { HelloService, HelloRequest, HelloResponse };
```

> particularmente eu não sei porque é assim, mas só sei que funciona, é só seguir essa logica para todos os pacotes, que você for definir.

depois basta importar o arquivo e usar, irei mostrar um exemplo de como fazer isso:

```typescript
import { ChannelCredentials, Client } from "@grpc/grpc-js";
import { HelloService } from "@/lib/gRPC/helloname";
import { promisify } from "util";
import { HelloServiceClient } from "@/proto/generated/helloname/HelloService";

const getGrpcClient = () => {
    if (process.env.GRPC_SERVER_HOST_NAME === undefined) {
        throw new Error("GRPC_SERVER_HOST_NAME is not set");
    }

    return new HelloService(
        `${process.env.GRPC_SERVER_HOST_NAME}:50051`,
        ChannelCredentials.createInsecure()
    );
};

const sayHelloAsync = promisify(
    (client: HelloServiceClient, request: { username: string }, callback: (error: Error | null, response: any) => void) => {
        client.sayHello(request, callback);
    }
);

export async function GET(request: Request) {
    try {
        const client = getGrpcClient();

        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username") || "world";
        const response = await sayHelloAsync(client, { username });

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("gRPC call failed:", error);
        return new Response(JSON.stringify({ error: "Request has failed, check server logs!" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
```

> No caso desse exemplo nós estamos convertendo o gRPC para um endpoint comum REST (para funcionar no client-side dos navegadores).

mas basicamente nós:

importamos os pacotes e arquivos necessários:

```typescript
import { ChannelCredentials, Client } from "@grpc/grpc-js";
import { HelloService } from "@/lib/gRPC/helloname";
import { promisify } from "util";
import { HelloServiceClient } from "@/proto/generated/helloname/HelloService";
```

criamos um novo ClienteRPC:

```typescript
const getGrpcClient = () => {
    if (process.env.GRPC_SERVER_HOST_NAME === undefined) {
        throw new Error("GRPC_SERVER_HOST_NAME is not set");
    }

    return new HelloService(
        `${process.env.GRPC_SERVER_HOST_NAME}:50051`,
        ChannelCredentials.createInsecure()
    );
};
```

definimos uma forma de chamar o serviço:

```typescript
const sayHelloAsync = promisify(
    (client: HelloServiceClient, request: { username: string }, callback: (error: Error | null, response: any) => void) => {
        client.sayHello(request, callback);
    }
);
```

> Nesse caso você poderia fazer somente:
> ```typescript
> client.sayHello(request, callback);
> ```
>
> eu converti para uma Promessa para que eu possa chamar/servir esse serviço no lado do cliente. 

basicamente é isso no lado do gRPC, uma vez que você chama o serviço ele te retorna uma resposta e ai é com você o que você irá querer fazer com essa resposta, no nosso caso aqui nós convertemos para JSON e retornamos no nosso wrapper REST.

```typescript
return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
        'Content-Type': 'application/json'
    }
});
```

se você for executar diretamente no lado do server o gRPC, você não precisa fazer essas conversões em REST, basta só importar e chamar.

basicamente é só seguir esses passos para cada serviço que você for definir.