# IAFinGoJS

Esse projeto é divido em 3 pastas:

- `backend/`
    - backend em Go, contém o binario da ferramenta CLI para auxiliar no gerenciamento do projeto, e também usa o [AIR](https://github.com/air-verse/air) para hot-reloading da aplicação.
- `frontend/`
    - frontend em NextJS v15.
- `cli/`
    - o código fonte da ferramenta CLI em Go para auxiliar no backend.

## setup

como começar com o projeto:

### Backend

para baixar o AIR execute:
```
go install github.com/air-verse/air@latest
```

e certifique-se de que o $GOPATH está configurado corretamente e disponivel no $PATH do seu terminal

para pegar as dependencias basta rodar: `go get ./...` na pasta backend para pegar todas as dependencias

> talvez depois eu melhore e ferramenta CLI para automaticamente fazer isso em todos os modulos do workspace, mas creio eu que assim também funciona.

e por fim executar um dos seguintes comandos na pasta `backend`:

caso você tenha o AIR: 
- execute: `air -c .air.toml`

caso você NÃO tenha o AIR: 
- execute `go run main.go`

a vantagem do AIR é que ele disponibiliza hot-reloading/compiling para o programa em Go.

### Frontend

`npm install`

`npm run dev`

ou

`bun install`

`bun run dev`