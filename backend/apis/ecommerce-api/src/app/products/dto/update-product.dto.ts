import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    price?: number; // em centavos

    @IsInt()
    @Min(0)
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    category?: string;
}
