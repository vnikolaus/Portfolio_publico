import { Prisma } from "@prisma/client";
import { afterAll, describe, expect, it } from 'vitest';

const URL = 'http://localhost:3000';

const CFG = {
    newId: -1,
    setId: (id: number) => CFG.newId = id
};

describe.skip('Testes API - Livros', () => {
    afterAll(async () => {
        if (CFG.newId === -1) return;
        
        const resDel = await fetch(`${URL}/books/${CFG.newId}`, {
            method: 'DELETE',
        })
        expect(resDel.status).toBe(204);
    })

    it('Should pong', async () => {
        const res  = await fetch(`${URL}/ping`);
        const raw  = await res.text();
        expect(res.status).toBe(200)
        expect(raw).toBe('pong')
    })

    it('Shoud list books', async () => {
        const res  = await fetch(`${URL}/books`);
        const raw  = await res.json();
        
        expect(res.status).toBe(200)
        expect(raw).toHaveProperty('result');

        expect(Array.isArray(raw.result)).toBe(true);
        expect(raw.result.length).toBeGreaterThanOrEqual(0);
    })

    it('Should add new book', async () => {
        const input: Prisma.BookCreateInput = {
            title:    'Livro teste',
            author:   'Vitest',
            pages:    100,
            quantity: 2,
        }
        const res = await fetch(`${URL}/books/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input)
        })
        const raw = await res.json();
        
        expect(res.status).toBe(201);
        expect(raw).toHaveProperty('result');

        expect(raw.result).toHaveProperty('id');
        expect(raw.result).toHaveProperty('title');
        expect(raw.result).toHaveProperty('author');
        expect(raw.result).toHaveProperty('pages');
        expect(raw.result).toHaveProperty('quantity');
        expect(raw.result).toHaveProperty('created_at');

        expect(raw.result.title).toBe(input.title);
        expect(raw.result.author).toBe(input.author);
        expect(raw.result.pages).toBe(input.pages);
        expect(raw.result.quantity).toBe(input.quantity);

        CFG.setId(raw.result.id)
    })

    it('Should update book', async () => {
        const input: Prisma.BookUpdateInput = {
            pages:    150,
            quantity: 5,
        }
        const res = await fetch(`${URL}/books/${CFG.newId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input)
        })
        const raw = await res.json();
        console.log("raw: ", raw);

        expect(res.status).toBe(201);
        expect(raw).toHaveProperty('result');

        expect(raw.result).toHaveProperty('id');
        expect(raw.result).toHaveProperty('title');
        expect(raw.result).toHaveProperty('author');
        expect(raw.result).toHaveProperty('pages');
        expect(raw.result).toHaveProperty('quantity');
        expect(raw.result).toHaveProperty('created_at');

        expect(raw.result.pages).toBe(input.pages);
        expect(raw.result.quantity).toBe(input.quantity);
    })
})