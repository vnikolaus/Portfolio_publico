# API - Reserva de Livros

API para gerenciamento de livros e reservas, desenvolvida com Node.js, TypeScript, Fastify, Prisma e PostgreSQL.

O projeto cobre o fluxo principal de cadastro de livros, criacao de reservas, controle de disponibilidade por periodo e atualizacao automatica do status das reservas por cron job.

---

## Visao Geral

| Item | Descricao |
| --- | --- |
| Runtime | Node.js |
| Linguagem | TypeScript |
| Framework | Fastify |
| ORM | Prisma |
| Banco de dados | PostgreSQL |
| Validacao | Zod |
| Testes | Vitest |
| Agendamentos | node-cron |

---

## Funcionalidades

- Cadastro, listagem, edicao e remocao de livros.
- Criacao e gerenciamento de reservas.
- Controle de limite de reservas por quantidade disponivel do livro.
- Atualizacao automatica de reservas `PENDING` para `ACTIVE`.
- Atualizacao automatica de reservas `ACTIVE` para `FINISHED`.
- Validacao dos dados de entrada com Zod.
- Persistencia com Prisma e PostgreSQL.

---

## Como Rodar

### 1. Instale as dependencias

```bash
npm install
```

### 2. Configure o ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT="3000"

DATABASE_URL="postgresql://admindocker:admindocker@localhost:5432/db_book_reservation?schema=public"

POSTGRES_USER=admindocker
POSTGRES_PASSWORD=admindocker
POSTGRES_DB=db_book_reservation
```

### 3. Suba o banco com Docker

```bash
docker-compose up -d
```

### 4. Rode as migrations

```bash
npx prisma migrate dev
```

### 5. Inicie a API

```bash
npm run dev
```

Por padrao, a API fica disponivel em:

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

---

## Endpoints

### Healthcheck

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/ping` | Verifica se a API esta online |

### Livros

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/books` | Lista todos os livros |
| `POST` | `/books/add` | Cadastra um novo livro |
| `PATCH` | `/books/:id` | Atualiza os dados de um livro |
| `DELETE` | `/books/:id` | Remove um livro |

### Reservas

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/reservations/add` | Cria uma nova reserva |
| `PATCH` | `/reservations/:id` | Atualiza uma reserva existente |
| `DELETE` | `/reservations/:id` | Remove uma reserva |

---

## Exemplos Visuais

### Livros

#### Listar Livros

![Exemplo de listagem de livros](./img/getBooks.gif)

#### Adicionar Livro

![Exemplo de cadastro de livro](./img/addBook.gif)

#### Atualizar Livro

![Exemplo de atualizacao de livro](./img/updateBook.gif)

#### Remover Livro

![Exemplo de remocao de livro](./img/deleteBook.gif)

### Reservas

#### Adicionar Reserva

GIF pendente: `./img/addReservation.gif`

#### Atualizar Reserva

GIF pendente: `./img/updateReservation.gif`

#### Remover Reserva

GIF pendente: `./img/deleteReservation.gif`

---

## Regras de Negocio

### Livros

- `title` e `author` sao obrigatorios.
- `title` e `author` formam uma combinacao unica.
- `pages` deve ser maior que zero.
- `quantity` nao pode ser negativa.

### Reservas

- Uma reserva sempre pertence a um livro.
- A reserva so pode ser criada para um livro existente.
- `start_date` e `end_date` precisam ser datas validas.
- `end_date` nao pode ser menor que `start_date`.
- O status inicial aceito no cadastro e `PENDING`.
- Se o periodo da reserva ja estiver ativo, a API pode salvar a reserva como `ACTIVE`.
- O limite de reservas no mesmo periodo respeita a quantidade disponivel do livro.

---

## Status das Reservas

| Status | Descricao |
| --- | --- |
| `PENDING` | Reserva criada para um periodo futuro |
| `ACTIVE` | Reserva dentro do periodo atual |
| `FINISHED` | Reserva com periodo encerrado |
| `CANCELLED` | Reserva cancelada |

---

## Agendamentos

A cada 10 minutos, a API executa uma rotina automatica para manter os status das reservas atualizados.

| Condicao | Acao |
| --- | --- |
| Reserva `PENDING` com `start_date` ja iniciado | Atualiza para `ACTIVE` |
| Reserva `ACTIVE` com `end_date` encerrado | Atualiza para `FINISHED` |

Log esperado:

```text
[Job] Status das reservas atualizado
```

---

## Banco de Dados

O banco utilizado e PostgreSQL, executado via Docker Compose.

Para visualizar os dados com Prisma Studio:

```bash
npx prisma studio
```

Endereco padrao:

```text
http://localhost:5555
```

---

## Estrutura

```text
src/
  app/
    controllers/
    routes/
    useCases/
    utils/
  infra/
    plugins/
prisma/
  migrations/
  schema.prisma
tests/
  e2e/
```

---

## Autor

Victor Nikolaus
