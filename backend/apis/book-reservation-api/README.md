# 📚 API - Reserva de livros

API responsável pelo gerenciamento de **livros** e **reservas**, construída com **Fastify**, **Prisma** e **PostgreSQL**.  
Inclui agendamento automático de atualização de status via **cron jobs**.

---

## ⚡ Instalação Rápida

```bash
git clone <repo-url>
cd <nome-da-api>

# criar o arquivo .env com as credenciais do banco

# subir o banco
docker-compose up -d

# instalar dependências da API
npm install
# e descomente "types": ["node"] no tsconfig ou instale @types/node

# rodar em dev
npm run dev
```

---

## 📋 Dependências

```
nodejs
typescript
fastify
zod
prisma
@prisma/client
vitest
node-cron
```

Banco de dados:  
- **PostgreSQL** (conectado via Prisma ORM)

---

## 💻 Endpoints

### GET /ping
Healthcheck da API.

**Response**
```
pong
```

---

### 📘 Livros

### GET /books
Lista todos os livros.

**Response**
```json
{
  "result": [
    {
      "id": 1,
      "title": "Livro teste",
      "author": "Vitest",
      "pages": 100,
      "quantity": 2,
      "created_at": "2025-09-17T12:00:00Z",
      "reservations": []
    }
  ]
}
```

### POST /books/add
Adiciona um novo livro.

![Exemplo de requisição para adicionar livro](./img/addBook.gif)


### PATCH /books/:id
Atualiza os dados de um livro.

**Body**
```json
{
  "pages": 150,
  "quantity": 5
}
```

**Response**
```json
{
  "result": {
    "id": "id",
    "title": "Livro teste",
    "author": "Vitest",
    "pages": 150,
    "quantity": 5,
    "created_at": "datetime"
  }
}
```

### DELETE /books/:id
Remove um livro.  
**Response:** HTTP 204 (No Content)

---

### 📖 Reservas

### POST /reservations/add
Cria uma nova reserva de livro.

**Body**
```json
{
  "book_id": 40,
  "duration": 7,
  "status": "PENDING",
  "start_date": "2025-09-17",
  "end_date": "2025-09-24"
}
```

**Response**
```json
{
  "result": {
    "id": "cuid",
    "book_id": 40,
    "duration": 7,
    "start_date": "2025-09-17T00:00:00.000Z", // Datetime
    "end_date": "2025-09-24T00:00:00.000Z",   // Datetime
    "status": "ACTIVE | PENDING"
  }
}
```

### PATCH /reservations/:id
Atualiza uma reserva existente.

**Body**
```json
{
  "duration": 10,
  "status": "CANCELLED"
}
```

**Response**
```json
{
  "result": {
    "id": "cuid",
    "book_id": 40,
    "duration": 10,
    "start_date": "2025-09-17T00:00:00.000Z", // Datetime
    "end_date": "2025-09-24T00:00:00.000Z",   // Datetime
    "status": "CANCELLED"
  }
}
```

### DELETE /reservations/:id
Remove uma reserva.  
**Response:** HTTP 204 (No Content)

---

## ⏱️ Agendamentos (Cron Jobs)

A cada **10 minutos**, a API executa verificações automáticas:

- Reservas com status **PENDING** cujo `start_date` já passou → são atualizadas para **ACTIVE**.  
- Reservas com status **ACTIVE** cujo `end_date` já passou → são atualizadas para **FINISHED**.

Log de execução:  
```
[Job] Status das reservas atualizado
```

---

## ⚙️ Testes Automatizados

```
✅ /ping - Healthcheck
✅ /books - Listagem, adição, atualização e remoção
✅ /reservations - Criação, atualização e remoção
```

---

## 🛠️ Construído com

* [NodeJS](https://nodejs.org/en)
* [TypeScript](https://www.typescriptlang.org/)
* [Fastify](https://fastify.dev/)
* [Prisma](https://www.prisma.io/)
* [PostgreSQL](https://www.postgresql.org/)
* [Zod](https://zod.dev/)
* [Vitest](https://vitest.dev/)
* [node-cron](https://www.npmjs.com/package/node-cron)

---

## 📌 Versão

V1.0.0

---

## ✒️ Autor

* **Victor Nikolaus** - *Desenvolvimento & Documentação* - [GitHub](https://github.com/vnikolaus)
