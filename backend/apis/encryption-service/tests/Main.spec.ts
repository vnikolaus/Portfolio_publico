import { describe, expect, it } from 'vitest';

const url = 'http://localhost:3000';

describe('Testes - API Criptografia', () => {
    it('Should pong', async () => {
        const res = await fetch(`${url}/ping`);
        const raw = await res.text();
        expect(raw).toBe('pong');
    })

    it('Should hash data', async () => {
        const data = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry';
        
        const res  = await fetch(`${url}/createHash`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: data
        });
        const raw  = await res.json();

        // Hash esperado do SHA-512 para o texto acima
        const expectedHash = "75da4856e1b809dd8195888ef8ec8dfd118acaa0b3ce0413e2204e7bc68c5914debba993bfd491d80cb02c4c515aaaf095602513d19103886ab0cfc6923f5f72";

        expect(raw).toEqual({ result: expectedHash });
        expect(res.status).toBe(201);
    })

    it('Should crypt and decrypt data', async () => {
        const TEST_KEY = 'test-key';
        const data     = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout';

        const resEnc  = await fetch(`${url}/aes/encrypt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: TEST_KEY,
                data
            })
        });
        const rawEnc  = await resEnc.json();
        
        expect(resEnc.status).toBe(201);
        expect(rawEnc).toHaveProperty('result');
        expect(rawEnc?.result).toHaveProperty('encrypted');
        expect(rawEnc?.result).toHaveProperty('iv');
        expect(rawEnc?.result).toHaveProperty('tag');

        const { result } = rawEnc;

        const resDec  = await fetch(`${url}/aes/decrypt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: TEST_KEY,
                ...result
            })
        });
        const rawDec  = await resDec.json();

        expect(resDec.status).toBe(201);
        expect(rawDec).toHaveProperty('result');
        expect(rawDec.result).toBe(data);
    })
})