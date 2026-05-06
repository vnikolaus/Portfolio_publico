import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/infra/database/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
    ) {}

    findAll() {
        return `This action returns all cart`;
    }

    findOne(id: number) {
        return `This action returns a #${id} cart`;
    }

    update(id: number, updateCartDto: UpdateCartDto) {
        console.log('updateCartDto: ', updateCartDto);
        return `This action updates a #${id} cart`;
    }

    remove(id: number) {
        return `This action removes a #${id} cart`;
    }

    async addItems(cartId: string, items: CreateCartDto['items']) {
        console.log('cartId: ', cartId);
        console.log('items: ', items);

        const cart = await this.cartRepo.findOne({
            where: { public_uuid: cartId },
        });
        console.log('cart: ', cart);

        // for (const it of items) {
        //     const product = await this.productRepo.findOne({
        //         where: { id: it.product_id },
        //     });
        //     console.log('product: ', product);
        // }

        return;
    }
}
