# Ticket Purchase Service V2

Aplicacao de compra de ingressos usando microservicos Node.js com TypeScript, PostgreSQL e RabbitMQ.

O objetivo do projeto e demonstrar um fluxo realista de compra assíncrona: o servico de tickets cria uma order e reserva os tickets, enquanto o servico de pagamento processa a transacao em outro processo e notifica o resultado por filas.

---

## Visao Geral

| Item | Descricao |
| --- | --- |
| Runtime | Node.js |
| Linguagem | TypeScript |
| Framework HTTP | Express |
| Banco de dados | PostgreSQL |
| Mensageria | RabbitMQ |
| Driver SQL | pg |
| Validacao | Zod |
| Testes | Vitest |
| Infra local | Docker Compose |

---

## Arquitetura

```txt
ticket-purchase-service-v2/
  ticket/      # eventos, orders, tickets e status da compra
  payment/     # processamento fake de pagamento e transactions
  create.sql   # schema inicial do PostgreSQL
  docker-compose.yml
```

### Modulos

| Modulo | Responsabilidade |
| --- | --- |
| `ticket` | Eventos, orders, tickets, disponibilidade e atualizacao do status da compra |
| `payment` | Processamento fake de pagamento, transactions e publicacao do resultado |

---

## Funcionalidades

- Cadastro, listagem, edicao e remocao de eventos.
- Criacao de orders com um ou mais tickets.
- Validacao de disponibilidade usando tickets `reserved` e `approved`.
- Reserva de tickets antes do pagamento.
- Processamento assíncrono de pagamento via RabbitMQ.
- Atualizacao automatica de orders e tickets apos o resultado do pagamento.
- Persistencia em PostgreSQL sem ORM, usando `pg`.
- Validacao de entrada com Zod.

---

## Fluxo assíncrono com RabbitMQ

O projeto possui dois modulos principais:

- `ticket`: responsavel por eventos, orders, tickets, validacao de disponibilidade e atualizacao do status da compra.
- `payment`: responsavel por consumir orders pendentes, simular o pagamento, persistir transactions e publicar o resultado.

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

---

## Demonstracao do fluxo

### Gerenciamento de eventos

Antes da compra, o modulo `ticket` permite cadastrar, listar, atualizar e remover eventos.

Criacao de evento:

![Create Event](./img/ticket/createEvent.gif)

Listagem de eventos:

![Get Events](./img/ticket/getEvents.gif)

Atualizacao de evento:

![Update Event](./img/ticket/updateEvent.gif)

Remocao de evento:

![Delete Events](./img/ticket/deleteEvents.gif)

### Criacao da order

O endpoint `POST /orders` cria a order, reserva os tickets e publica a mensagem na fila `orderPending`.

![Create Order](./img/ticket/createOrder.gif)

### Consulta antes do pagamento

Logo apos a criacao, a order ainda esta com status `pending` e os tickets estao reservados.

![Get Order Pending](./img/ticket/getOrderPending.gif)

Fila `orderPending` sendo populada:

![Order Pending](./img/queue/orderPending-img.jpg)

### Pagamento processado

O servico `payment` consome `orderPending`, processa o pagamento fake, persiste a transaction e publica `orderPaid`.

![Order Paid Queue](./img/queue/orderPaid.gif)

### Order aprovada

O servico `ticket` consome `orderPaid`, atualiza a order para `paid` e altera os tickets para `approved`.

![Approve Order](./img/queue/orderApproved.gif)

### Consulta da order

Depois do processamento, a order pode ser consultada novamente. Nesse ponto, a order esta `paid` e os tickets estao `approved`.

![Get Order Paid](./img/ticket/getOrderPaid.gif)

---

## Endpoints principais

### Ticket service

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/health` | Verifica se o servico esta online |
| `POST` | `/orders` | Cria uma order e reserva tickets |
| `GET` | `/orders/:orderId` | Consulta uma order com seus tickets |
| `POST` | `/events` | Cadastra um evento |
| `GET` | `/events` | Lista eventos |
| `PUT` | `/events/:eventId` | Atualiza um evento |
| `DELETE` | `/events/:eventId` | Remove um evento |

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

Isso evita problemas de precisao com valores monetarios.

---

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

---

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

---

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

---

## Scripts

Os dois modulos possuem os mesmos scripts principais.

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servico em modo desenvolvimento |
| `npm run build` | Compila o projeto |
| `npm start` | Executa a versao compilada |
| `npm run typecheck` | Executa a checagem de tipos |
| `npm test` | Executa os testes com Vitest |

---

## Testes

Cada modulo possui testes unitarios, e2e e de integracao.

```bash
npm test -- --run
```

Evidencias:

Modulo `ticket`:

![Ticket Tests](./img/ticket/testsTicket.jpg)

Modulo `payment`:

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
- Entidades concentram estado e transicoes simples.
- Use cases orquestram regras de negocio.
- Subscribers recebem eventos do RabbitMQ.
- O pagamento e processado de forma assíncrona.
- O estoque considera tickets `reserved` e `approved` para evitar vender alem da capacidade.

---

## Autor

Victor Nikolaus
