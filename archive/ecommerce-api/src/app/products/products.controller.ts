import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createProductDto: CreateProductDto) {
        return await this.productsService.create(createProductDto);
    }

    @Get()
    async findAll() {
        return await this.productsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string | number) {
        return await this.productsService.findOne(+id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.CREATED)
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return await this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string | number) {
        return await this.productsService.remove(+id);
    }
}
