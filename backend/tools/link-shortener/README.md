# Link Shortener

API para encurtamento de links, desenvolvida com NestJS, TypeScript, MongoDB e Mongoose.

O projeto cobre o fluxo principal de cadastro de URLs, geracao de codigos curtos, listagem, busca, remocao e redirecionamento para o link original.

---

## Visao Geral

| Item | Descricao |
| --- | --- |
| Runtime | Node.js |
| Linguagem | TypeScript |
| Framework | NestJS |
| Banco de dados | MongoDB |
| ODM | Mongoose |
| Validacao | class-validator |
| Configuracao | @nestjs/config |
| Lint | ESLint |

---

## Funcionalidades

- Healthcheck da API.
- Criacao de link encurtado a partir de uma URL.
- Geracao de codigo curto aleatorio.
- Validacao da URL recebida no body.
- Listagem de links cadastrados.
- Busca de link por ID.
- Remocao de link por ID.
- Redirecionamento publico pelo codigo curto.
- Persistencia em MongoDB via Docker.

---

## Como Rodar

### 1. Instale as dependencias

```bash
npm install
```

### 2. Configure o ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
MONGO_INITDB_ROOT_USERNAME=link_shortener
MONGO_INITDB_ROOT_PASSWORD=link_shortener
MONGO_INITDB_DATABASE=link_shortener
MONGO_PORT=27017

MONGODB_URI=mongodb://link_shortener:link_shortener@localhost:27017/link_shortener?authSource=admin
```

### 3. Suba o banco com Docker

```bash
docker compose up -d
```

### 4. Inicie a API

```bash
npm run dev
```

Por padrao, caso `PORT` nao seja informado, a API usa:

```text
http://localhost:3000
```

---

## Scripts

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia a API em modo desenvolvimento |
| `npm run build` | Compila o projeto TypeScript |
| `npm start` | Executa a versao compilada |
| `npm run lint` | Executa o ESLint com correcao automatica |
| `npm run test` | Executa os testes |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run test:cov` | Executa os testes com coverage |

---

## Endpoints

### Healthcheck

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/ping` | Verifica se a API esta online |

### Links

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/links` | Cria um link encurtado |
| `GET` | `/links` | Lista todos os links |
| `GET` | `/links/:id` | Busca um link por ID |
| `DELETE` | `/links/:id` | Remove um link por ID |

### Redirecionamento

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/r/:code` | Redireciona para a URL original |

---

## Exemplos de Requisicao

### Criar Link

**POST** `/links`

Body `application/json`:

```json
{
  "url": "https://exemplo.com/pagina/grande"
}
```

Resposta `201`:

```json
{
  "id": "objectId",
  "url": "https://exemplo.com/pagina/grande",
  "code": "wNDiZ",
  "createdAt": "2026-05-01T00:05:17.638Z"
}
```

### Listar Links

**GET** `/links`

Resposta `200`:

```json
[
  {
    "_id": "objectId",
    "url": "https://exemplo.com/pagina/grande",
    "code": "wNDiZ",
    "createdAt": "2026-05-01T00:05:17.638Z"
  }
]
```

### Buscar Link

**GET** `/links/:id`

Resposta `200`:

```json
{
  "_id": "objectId",
  "url": "https://exemplo.com/pagina/grande",
  "code": "wNDiZ",
  "createdAt": "2026-05-01T00:05:17.638Z"
}
```

### Remover Link

**DELETE** `/links/:id`

Resposta `200` sem body.

### Redirecionar

**GET** `/r/:code`

Resposta:

```text
302 Found
Location: https://exemplo.com/pagina/grande
```

---

## Exemplos Visuais

### Criar Link

![Exemplo de criacao de link encurtado](./img/shortLink.gif)

### Listar Links

![Exemplo de listagem de links](./img/listLinks.gif)

### Buscar Link

![Exemplo de busca de link](./img/findLink.gif)

### Remover Link

![Exemplo de remocao de link](./img/deleteLink.gif)

### Redirecionar Link

![Exemplo de redirecionamento de link](./img/redirectLink.gif)

---

## Regras e Validacoes

### Links

- `url` e obrigatoria na criacao.
- `url` deve ser uma URL valida.
- `url` deve conter protocolo, como `https://` ou `http://`.
- O codigo curto e gerado automaticamente.
- O codigo curto deve ser unico na collection `links`.
- Links inexistentes retornam `404`.

### Redirecionamento

- O endpoint publico usa o codigo curto em `/r/:code`.
- Quando o codigo existe, a API responde com redirect HTTP para a URL original.
- Quando o codigo nao existe, a API retorna `404`.

---

## Banco de Dados

A API utiliza MongoDB executado via Docker Compose.

Container padrao:

```text
link_shortener_mongo
```

Banco utilizado:

```text
link_shortener
```

Collection utilizada:

```text
links
```

---

## Estrutura

```text
src/
  app/
    modules/
      links/
        dto/
        entities/
  infra/
    database/
img/
```

---

## Autor

Victor Nikolaus
