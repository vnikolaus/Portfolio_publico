/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductDto } from 'src/app/products/dto/update-product.dto';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateProductDto } from '../src/app/products/dto/create-product.dto';
import { DatabaseModule } from '../src/infra/database/database.module';

const SUT = {
    id: 1,
} as { id: string | number };

describe('ProductsController (e2e)', () => {
    let app: INestApplication<App>;
    let gateway: TestAgent;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        gateway = request(app.getHttpServer());
    });

    afterAll(async () => {
        if (SUT.id === 1) return;

        await gateway.delete(`/products/${SUT.id}`).expect(204);
    });

    it('/products (POST)', async () => {
        const product: CreateProductDto = {
            name: 'Produto teste',
            description: 'Teste E2E',
            sku: 'SKU-JEST-123',
            price: 1999, // em centavos
            stock: 10,
            category: 'teste',
        };

        const res = await gateway.post('/products').send(product).expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(product.name);

        SUT.id = res.body.id;
    });

    it('/products (GET)', async () => {
        const res = await gateway.get('/products').expect(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
    });

    it('/products/:id (GET)', async () => {
        const res = await gateway.get(`/products/${SUT.id}`).expect(200);

        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('sku');
        expect(res.body).toHaveProperty('category');
        expect(res.body.category).toBe('teste');
    });

    it('/products/:id (PATCH)', async () => {
        const product: UpdateProductDto = {
            price: 2599, // em centavos
            stock: 20,
        };
        const res = await gateway
            .patch(`/products/${SUT.id}`)
            .send(product)
            .expect(201);

        expect(res.body).toHaveProperty('affected');
        expect(res.body.affected).toBe(1);
    });
});
