# Ticket Purchase Service

Aplicação de compra de ingressos usando microserviços Node.js com TypeScript, PostgreSQL e RabbitMQ.

O objetivo do projeto é demonstrar um fluxo realista de compra assíncrona: o serviço de tickets cria uma order e reserva os tickets, enquanto o serviço de pagamento processa a transação em outro processo e notifica o resultado por filas.

---

## Visão Geral

| Item | Descrição |
| --- | --- |
| Runtime | Node.js |
| Linguagem | TypeScript |
| Framework HTTP | Express |
| Banco de dados | PostgreSQL |
| Mensageria | RabbitMQ |
| Driver SQL | pg |
| Validação | Zod |
| Testes | Vitest |
| Infra local | Docker Compose |

---

## Arquitetura

```txt
ticket-purchase-service/
  ticket/      # eventos, orders, tickets e status da compra
  payment/     # processamento fake de pagamento e transactions
  create.sql   # schema inicial do PostgreSQL
  docker-compose.yml
```

### Módulos

| Módulo | Responsabilidade |
| --- | --- |
| `ticket` | Eventos, orders, tickets, disponibilidade e atualização do status da compra |
| `payment` | Processamento fake de pagamento, transactions e publicação do resultado |

---

## Funcionalidades

- Cadastro, listagem, edição e remoção de eventos.
- Criação de orders com um ou mais tickets.
- Validação de disponibilidade usando tickets `reserved` e `approved`.
- Reserva de tickets antes do pagamento.
- Processamento assíncrono de pagamento via RabbitMQ.
- Atualização automática de orders e tickets após o resultado do pagamento.
- Persistência em PostgreSQL sem ORM, usando `pg`.
- Validação de entrada com Zod.

---

## Fluxo assíncrono com RabbitMQ

O projeto possui dois módulos principais:

- `ticket`: responsável por eventos, orders, tickets, validação de disponibilidade e atualização do status da compra.
- `payment`: responsável por consumir orders pendentes, simular o pagamento, persistir transactions e publicar o resultado.

O fluxo principal foi desenhado para separar a criação da compra do processamento do pagamento.

```txt
1. POST /orders
2. ticket cria Order com status pending
3. ticket cria Tickets com status reserved
4. ticket publica orderPending no RabbitMQ
5. payment consome orderPending
6. payment simula a consulta em um gateway de pagamento
7. payment cria Transaction com status paid ou failed
8. payment publica orderPaid ou orderPaymentFailed
9. ticket consome o resultado
10. ticket atualiza Order e Tickets
```

Estados usados:

```txt
orders: pending | paid | cancelled
tickets: reserved | approved | cancelled
transactions: pending | paid | failed
```

---

## Demonstração do fluxo

### Gerenciamento de eventos

Antes da compra, o módulo `ticket` permite cadastrar, listar, atualizar e remover eventos.

Criação de evento:

![Create Event](./img/ticket/createEvent.gif)

Listagem de eventos:

![Get Events](./img/ticket/getEvents.gif)

Atualização de evento:

![Update Event](./img/ticket/updateEvent.gif)

Remoção de evento:

![Delete Events](./img/ticket/deleteEvents.gif)

### Criação da order

O endpoint `POST /orders` cria a order, reserva os tickets e publica a mensagem na fila `orderPending`.

![Create Order](./img/ticket/createOrder.gif)

### Consulta antes do pagamento

Logo após a criação, a order ainda está com status `pending` e os tickets estão reservados.

![Get Order Pending](./img/ticket/getOrderPending.gif)

Fila `orderPending` sendo populada:

![Order Pending](./img/queue/orderPending-img.jpg)

### Pagamento processado

O serviço `payment` consome `orderPending`, processa o pagamento fake, persiste a transaction e publica `orderPaid`.

![Order Paid Queue](./img/queue/orderPaid.gif)

### Order aprovada

O serviço `ticket` consome `orderPaid`, atualiza a order para `paid` e altera os tickets para `approved`.

![Approve Order](./img/queue/orderApproved.gif)

### Consulta da order

Depois do processamento, a order pode ser consultada novamente. Nesse ponto, a order está `paid` e os tickets estão `approved`.

![Get Order Paid](./img/ticket/getOrderPaid.gif)

---

## Endpoints principais

### Ticket service

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica se o serviço está online |
| `POST` | `/orders` | Cria uma order e reserva tickets |
| `GET` | `/orders/:orderId` | Consulta uma order com seus tickets |
| `POST` | `/events` | Cadastra um evento |
| `GET` | `/events` | Lista eventos |
| `PUT` | `/events/:eventId` | Atualiza um evento |
| `DELETE` | `/events/:eventId` | Remove um evento |

Exemplo de criação de evento:

```json
{
  "description": "Sao Paulo Games Expo",
  "capacity": 5000,
  "priceInCents": 12000,
  "address": "Rodovia dos Imigrantes, Km 1.5",
  "city": "Sao Paulo",
  "state": "SP",
  "country": "Brasil",
  "zipcode": "04329-900"
}
```

Exemplo de criação de order:

```json
{
  "eventId": "267d40de-56aa-45b6-83a6-64d075a97620",
  "email": "john@doe.com",
  "creditCardToken": "123456",
  "quantity": 2
}
```

---

## Banco de dados

O schema inicial cria:

```txt
events
orders
tickets
transactions
```

O dinheiro fica armazenado em centavos:

```txt
price_in_cents
total_price_in_cents
```

Isso evita problemas de precisão com valores monetários.

---

## Como rodar

Subir infraestrutura:

```bash
docker compose up -d
```

O PostgreSQL executa automaticamente o `create.sql` na primeira inicialização do volume.

Se precisar recriar o banco do zero:

```bash
docker compose down -v
docker compose up -d
```

RabbitMQ Management:

```txt
http://localhost:15672
user: admin
password: admin
```

---

## Variáveis de ambiente

Cada módulo possui `.env.example`.

Exemplo:

```env
PORT=MINHA_PORTA
DATABASE_URL=MINHA_URL_DO_POSTGRES
AMQP_URL=MINHA_URL_DO_RABBITMQ
```

Para o ambiente local com o compose:

```env
DATABASE_URL=postgresql://admin:admin@localhost:5432/ticket
AMQP_URL=amqp://admin:admin@localhost:5672
```

---

## Rodando os serviços

Ticket:

```bash
cd ticket
npm install
npm run dev
```

Payment:

```bash
cd payment
npm install
npm run dev
```

---

## Scripts

Os dois módulos possuem os mesmos scripts principais.

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o serviço em modo desenvolvimento |
| `npm run build` | Compila o projeto |
| `npm start` | Executa a versão compilada |
| `npm run typecheck` | Executa a checagem de tipos |
| `npm test` | Executa os testes com Vitest |

---

## Testes

Cada módulo possui testes unitários, e2e e de integração.

```bash
npm test -- --run
```

Evidências:

Módulo `ticket`:

![Ticket Tests](./img/ticket/testsTicket.jpg)

Módulo `payment`:

![Payment Tests](./img/ticket/testsPayments.jpg)

---

## Estrutura

```txt
ticket/
  src/
    app/
      controllers/
      repositories/
      routes/
      subscribers/
      useCases/
    domain/
      entities/
    infra/
      container/
      db/
      queue/
      repository/
  tests/
    e2e/
    integracao/
    unitario/

payment/
  src/
    app/
      gateways/
      repositories/
      subscribers/
      useCases/
    domain/
      entities/
    infra/
      container/
      db/
      gateway/
      queue/
      repository/
  tests/
    e2e/
    integracao/
    unitario/
```

---

## Pontos de projeto

- Repositories trabalham com PostgreSQL direto via `pg`.
- Entidades concentram estado e transições simples.
- Use cases orquestram regras de negócio.
- Subscribers recebem eventos do RabbitMQ.
- O pagamento é processado de forma assíncrona.
- O estoque considera tickets `reserved` e `approved` para evitar vender além da capacidade.

---

## Autor

Victor Nikolaus
