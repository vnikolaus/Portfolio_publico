/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post('items')
    async addItem(
        @Body() body: CreateCartDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        let cartId = req.cookies['cart_id'] as string;

        if (!cartId) {
            cartId = crypto.randomUUID();
            res.cookie('cart_id', cartId, {
                httpOnly: true,
                path: '/',
                maxAge: 1000 * 60 * 60 * 24,
            });
            console.log('[new_cart]:', cartId);
        } else {
            console.log('[existent_cart]:', cartId);
        }

        // await this.cartService.addItems(body.items);
        await this.cartService.addItems(cartId, body.items);

        // Aqui chama service.addItem(cartId, body.productId, body.quantity)
        return res.json({ cartId, added: true }); // retorna com a res pra garantir o envio do cookie
    }

    @Get()
    findAll() {
        return this.cartService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cartService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
        return this.cartService.update(+id, updateCartDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cartService.remove(+id);
    }
}
