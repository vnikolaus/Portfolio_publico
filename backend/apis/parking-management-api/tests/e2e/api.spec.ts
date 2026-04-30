import { describe, expect, it } from 'vitest';

const PLATE_TEST = 'ABC1234';
const url = 'http://localhost:3000';

describe('Testes - API Estacionamento', () => {
    it('Should pong', async () => {
        const res = await fetch(`${url}/ping`);
        const raw = await res.text();
        expect(raw).toBe('pong');
    })

    it.skip('Should checkin car', async () => {
        const res = await fetch(`${url}/car/checkin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plate: PLATE_TEST })
        });
        const raw = await res.json()

        expect(raw).toHaveProperty('result');

        expect(raw.result).toHaveProperty('id');
        expect(raw.result).toHaveProperty('plate');
        expect(raw.result).toHaveProperty('parked');
        expect(raw.result).toHaveProperty('info');

        expect(raw.result.info).toHaveProperty('checkin');
        expect(raw.result.info).toHaveProperty('total');

        expect(raw.result.plate).toBe(PLATE_TEST);
        expect(raw.result.parked).toBe(true);
    })

    it.skip('Should checkout car', async () => {
        const res = await fetch(`${url}/car/checkout`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plate: PLATE_TEST })
        });
        const raw = await res.json();

        expect(raw).toHaveProperty('result');

        expect(raw.result).toHaveProperty('id');
        expect(raw.result).toHaveProperty('plate');
        expect(raw.result).toHaveProperty('parked');
        expect(raw.result).toHaveProperty('info');

        expect(raw.result.info).toHaveProperty('checkin');
        expect(raw.result.info).toHaveProperty('checkout');
        expect(raw.result.info).toHaveProperty('total');

        expect(raw.result.plate).toBe(PLATE_TEST);
        expect(raw.result.parked).toBe(false);
    })

    it('Should list cars', async () => {
        const res = await fetch(`${url}/car/list`);
        const raw = await res.json();

        expect(raw).toHaveProperty('result');

        expect(Array.isArray(raw.result)).toBe(true);
        expect(raw.result.length).toBeGreaterThanOrEqual(0);
    })
})