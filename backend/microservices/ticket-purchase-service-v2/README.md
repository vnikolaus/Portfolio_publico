# Ticket Purchase Service V2

Refatoracao de uma aplicacao de compra de ingressos usando dois microservicos Node.js com TypeScript, PostgreSQL e RabbitMQ.

O objetivo do projeto e demonstrar um fluxo realista de compra assíncrona: o servico de tickets cria uma order e reserva os tickets, enquanto o servico de pagamento processa a transacao em outro processo e notifica o resultado por filas.

## Arquitetura

```txt
ticket-purchase-service-v2/
  ticket/      # eventos, orders, tickets e status da compra
  payment/     # processamento fake de pagamento e transactions
  create.sql   # schema inicial do PostgreSQL
  docker-compose.yml
```

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL com `pg`
- RabbitMQ com `amqplib`
- Zod
- Vitest
- Docker Compose

## Fluxo assíncrono com RabbitMQ

O fluxo principal foi desenhado para separar a criacao da compra do processamento do pagamento.

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

## Demonstracao do fluxo

### Criacao da order

O endpoint `POST /orders` cria a order, reserva os tickets e publica a mensagem na fila `orderPending`.

![Create Order](./img/ticket/createOrder.gif)

Fila `orderPending` sendo populada:

![Order Pending](./img/queue/orderPending-img.jpg)

### Pagamento processado

O servico `payment` consome `orderPending`, processa o pagamento fake, persiste a transaction e publica `orderPaid`.

![Order Paid Queue](./img/queue/orderPaid.gif)

### Order aprovada

O servico `ticket` consome `orderPaid`, atualiza a order para `paid` e altera os tickets para `approved`.

![Approve Order](./img/queue/approveOrder.gif)

### Consulta da order

Depois do processamento, a order pode ser consultada com seus tickets.

![Get Order Paid](./img/ticket/getOrderPaid.gif)

## Endpoints principais

### Ticket service

```txt
GET    /health
POST   /orders
GET    /orders/:orderId
POST   /events
GET    /events
PUT    /events/:eventId
DELETE /events/:eventId
```

Exemplo de criacao de evento:

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

Exemplo de criacao de order:

```json
{
  "eventId": "267d40de-56aa-45b6-83a6-64d075a97620",
  "email": "john@doe.com",
  "creditCardToken": "123456",
  "quantity": 2
}
```

## Banco de dados

O schema inicial cria:

```txt
events
orders
tickets
transactions
```

O dinheiro e armazenado em centavos:

```txt
price_in_cents
total_price_in_cents
```

Isso evita problemas de precisao com valores monetarios.

## Como rodar

Subir infraestrutura:

```bash
docker compose up -d
```

O PostgreSQL executa automaticamente o `create.sql` na primeira inicializacao do volume.

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

## Variaveis de ambiente

Cada modulo possui `.env.example`.

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

## Rodando os servicos

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

## Testes

Cada modulo possui testes unitarios, e2e e de integracao.

```bash
npm test -- --run
```

Evidencias:

![Ticket Tests](./img/ticket/testsTicket.jpg)

![Payment Tests](./img/ticket/testsPayments.jpg)

## Pontos de projeto

- Repositories trabalham com PostgreSQL direto via `pg`.
- Entidades concentram estado e transicoes simples.
- Use cases orquestram regras de negocio.
- Subscribers recebem eventos do RabbitMQ.
- O pagamento e processado de forma assíncrona.
- O estoque considera tickets `reserved` e `approved` para evitar vender alem da capacidade.
