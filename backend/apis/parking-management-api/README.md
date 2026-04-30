# 🚗 API de Estacionamento

API para controle de check-in e check-out de veículos em um estacionamento, com cálculo automático do valor a pagar e persistência em banco de dados próprio (**KlauzDB**).

## ⚡ Instalação Rápida

```bash
git clone <repo-url>
cd <nome-da-api>

npm install
# e descomente "types": ["node"] no tsconfig ou instale @types/node
npm run dev
```

## 📋 Dependências

```
nodejs
typescript
express
zod
vitest
```


## 💻 Endpoints

### `GET /ping`
Verifica se a API está no ar.

---

### `POST /car/checkin`
Registra a entrada de um carro.

**Body**
```json
{
  "plate": "ABC1234"
}
```

**Response**
```json
{
  "result": {
    "id": "uuid",
    "plate": "ABC1234",
    "parked": true,
    "info": {
      "checkin": 1758120137983,
      "total": 0
    }
  }
}
```

---

### `PATCH /car/checkout`
Registra a saída de um carro e calcula o valor a pagar.

**Body**
```json
{
  "plate": "ABC1234"
}
```

**Response**
```json
{
  "result": {
    "id": "uuid",
    "plate": "ABC1234",
    "parked": false,
    "info": {
      "checkin": 1758120137983,
      "checkout": 1758120137992,
      "total": 15
    }
  }
}
```

---

### `GET /car/list`
Lista todos os veículos no estacionamento.

**Response**
```json
{
  "result": [
    {
      "id": "3ad841e0-32b4-47b7-a458-3728788ca2eb",
      "plate": "ABC1234",
      "parked": false,
      "info": {
        "checkin": 1758120137983,
        "checkout": 1758120137992,
        "total": 15
      }
    }
  ]
}
```

---

## 🔹 Regras de Tarifação

- Até **15 minutos** → gratuito.
- Até **1 hora** → R$ 12,00.
- Até **2 horas** → R$ 15,00.
- Após 2h → acréscimo de **R$ 3,00 por hora adicional**.

---

## 🔹 Persistência dos Dados (KlauzDB)

A API utiliza um banco de dados autoral chamado **KlauzDB**, que persiste as informações em arquivos JSON.  
Cada coleção possui metadados de criação, última interação e os registros salvos.

**Exemplo de persistência:**
```json
{
  "collection_name": "parking",
  "created_at": "2025-09-17T03:35:47.094Z",
  "last_interaction": "2025-09-17T14:57:50.774Z",
  "data": [
    {
      "id": "3ad841e0-32b4-47b7-a458-3728788ca2eb",
      "plate": "ABC1234",
      "parked": false,
      "info": {
        "checkin": 1758120137983,
        "checkout": 1758120137992,
        "total": 15
      },
      "_zid": 1
    }
  ]
}
```

---

## ⚙️ Testes Automatizados (Vitest)

- **Unitários** → cálculo de tarifas (`CalculatePrice`).
- **E2E** → endpoints da API (`/checkin`, `/checkout`, `/list`).

Exemplo de teste unitário:
```ts
it('Calculate 1:15h', async () => {
    const _in   = Date.now();
    const _out  = _in + (1 * 60 + 15) * 60 * 1000;
    const total = calculatePrice.exec(_in, _out);
    expect(total).toBe(15);
})
```

---

## 🛠️ Construído com

* [NodeJS](https://nodejs.org/en)
* [TypeScript](https://www.typescriptlang.org/)
* [ExpressJS](https://expressjs.com/pt-br/)
* [Zod](https://zod.dev/)
* [Vitest](https://vitest.dev/)

---

## 📌 Versão

V1.0.0

---

## ✒️ Autores

* **Victor Nikolaus** - *Desenvolvimento & Documentação* - [GitHub](https://github.com/vnikolaus)

