import { Prisma } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const URL = 'http://localhost:3000';

const CFG = {
    newId: '',
    setId: (id: string) => CFG.newId = id
};

const CFG_BOOK = {
    newId: -1,
    setId: (id: number) => CFG_BOOK.newId = id
};

describe.skip('Testes API - Reservas', () => {
    beforeAll(async () => {
        const input: Prisma.BookCreateInput = {
            title:    'Livro teste reserva',
            author:   'Vitest',
            pages:    100,
            quantity: 1,
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

        CFG_BOOK.setId(raw.result.id);
    })

    afterAll(async () => {
        if (CFG_BOOK.newId === -1) return;
        
        const resDel = await fetch(`${URL}/books/${CFG_BOOK.newId}`, {
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

    it('Should add reservation', async () => {
        const input: Prisma.ReservationUncheckedCreateInput = {
            duration:   7,
            book_id:    CFG_BOOK.newId,
            status:     'PENDING',
            start_date: '2025-09-17',
            end_date:   '2025-09-24',
        }
        const res  = await fetch(`${URL}/reservations/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        });
        const raw  = await res.json();

        expect(res.status).toBe(201);
        expect(raw).toHaveProperty('result');

        expect(raw.result).toHaveProperty('id');
        expect(raw.result).toHaveProperty('book_id');
        expect(raw.result).toHaveProperty('duration');
        expect(raw.result).toHaveProperty('start_date');
        expect(raw.result).toHaveProperty('end_date');
        expect(raw.result).toHaveProperty('status');

        expect(raw.result.book_id).toBe(input.book_id);
        expect(raw.result.duration).toBe(input.duration);

        CFG.setId(raw.result.id);
    })

    it('Should update reservation', async () => {
        const input: Prisma.ReservationUncheckedUpdateInput = {
            duration:   10,
            status:     'CANCELLED'
        }
        const res = await fetch(`${URL}/reservations/${CFG.newId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input)
        })
        const raw = await res.json();

        expect(res.status).toBe(201);
        expect(raw).toHaveProperty('result');

        expect(raw.result).toHaveProperty('id');
        expect(raw.result).toHaveProperty('book_id');
        expect(raw.result).toHaveProperty('duration');
        expect(raw.result).toHaveProperty('start_date');
        expect(raw.result).toHaveProperty('end_date');
        expect(raw.result).toHaveProperty('status');

        expect(raw.result.id).toBe(CFG.newId);
        expect(raw.result.duration).toBe(input.duration);
        expect(raw.result.status).toBe(input.status);
    })
})