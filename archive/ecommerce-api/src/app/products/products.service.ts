import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../infra/database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private productRepo: Repository<Product>,
    ) {}

    async create(createProductDto: CreateProductDto) {
        const newProduct = await this.productRepo.save(createProductDto);
        return newProduct;
    }

    async findAll() {
        return await this.productRepo.find({
            where: { is_active: true },
            select: [
                'id',
                'name',
                'description',
                'sku',
                'price',
                'stock',
                'category',
            ],
            relations: ['cartItems'],
        });
    }

    async findOne(id: number) {
        return await this.productRepo.findOne({
            where: { id },
            relations: ['cartItems'],
        });
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        return await this.productRepo.update(id, { ...updateProductDto });
    }

    async remove(id: number) {
        return await this.productRepo.delete(id);
    }
}
