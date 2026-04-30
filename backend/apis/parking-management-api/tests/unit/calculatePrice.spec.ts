import { describe, expect, it } from 'vitest';
import { CalculatePrice } from '../../src/app/useCases/CalculatePrice';

describe('Testes - Calcular Preço', () => {
    const calculatePrice = new CalculatePrice();

    it('Calculate 10min', async () => {
        const _in   = Date.now();
        const _out  = _in + (10) * 60 * 1000;
        const total = calculatePrice.exec(_in, _out);
        expect(total).toBe(0);
    })

    it('Calculate 45min', async () => {
        const _in   = Date.now();
        const _out  = _in + (45) * 60 * 1000;
        const total = calculatePrice.exec(_in, _out);
        expect(total).toBe(12);
    })

    it('Calculate 1:15h', async () => {
        const _in   = Date.now();
        const _out  = _in + (1 * 60 + 15) * 60 * 1000;
        const total = calculatePrice.exec(_in, _out);
        expect(total).toBe(15);
    })

    it('Calculate 1:59h', async () => {
        const _in   = Date.now();
        const _out  = _in + (1 * 60 + 59) * 60 * 1000;
        const total = calculatePrice.exec(_in, _out);
        expect(total).toBe(15);
    })

    it('Calculate 2:45h', async () => {
        const _in   = Date.now();
        const _out  = _in + (2 * 60 + 45) * 60 * 1000;
        const total = calculatePrice.exec(_in, _out);
        expect(total).toBe(18);
    })

    it('Calculate 4:30h', async () => {
        const _in   = Date.now();
        const _out  = _in + (4 * 60 + 30) * 60 * 1000;
        const total = calculatePrice.exec(_in, _out);
        expect(total).toBe(24);
    })

    it('Calculate 6:00h', async () => {
        const _in   = Date.now();
        const _out  = _in + (6 * 60) * 60 * 1000;
        const total = calculatePrice.exec(_in, _out);
        expect(total).toBe(27);
    })

    it('Calculate 12:00h', async () => {
        const _in   = Date.now();
        const _out  = _in + (12 * 60) * 60 * 1000;
        const total = calculatePrice.exec(_in, _out);
        expect(total).toBe(45);
    })
})