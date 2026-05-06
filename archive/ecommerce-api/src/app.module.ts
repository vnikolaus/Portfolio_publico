import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CartModule } from './app/cart/cart.module';
import { ProductsModule } from './app/products/products.module';
import { DatabaseModule } from './infra/database/database.module';
import { CartItem } from './infra/database/entities/cart-item.entity';
import { Cart } from './infra/database/entities/cart.entity';
import { Product } from './infra/database/entities/product.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // <- torna disponível globalmente
            envFilePath: '.env', // opcional, padrão é .env
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [Product, Cart, CartItem], // todas suas entidades aqui
            synchronize: true, // só usar em dev
        }),
        DatabaseModule,
        ProductsModule,
        CartModule,
    ],
    controllers: [AppController],
    providers: [],
    exports: [],
})
export class AppModule {}
