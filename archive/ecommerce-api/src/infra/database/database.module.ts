import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { Product } from './entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Cart, CartItem])],
    exports: [TypeOrmModule.forFeature([Product, Cart, CartItem])],
})
export class DatabaseModule {}
