import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DatabaseModule } from './../src/infra/database/database.module';

describe('AppController (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ping (GET)', async () => {
        const gateway = request(app.getHttpServer());
        const res = await gateway.get('/ping');
        expect(res.status).toBe(200);
        expect(res.text).toBe('pong');
    });
});
