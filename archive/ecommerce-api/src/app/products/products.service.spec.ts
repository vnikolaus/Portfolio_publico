/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
    let controller: ProductsController;
    let service: ProductsService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController], // controller sendo testado
            providers: [
                {
                    provide: ProductsService, // mock do service
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([]),
                        create: jest
                            .fn()
                            .mockImplementation((dto) => ({ id: 1, ...dto })),
                    },
                },
            ],
        }).compile();

        controller = moduleFixture.get<ProductsController>(ProductsController);
        service = moduleFixture.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(controller).toBeDefined();
    });
});
