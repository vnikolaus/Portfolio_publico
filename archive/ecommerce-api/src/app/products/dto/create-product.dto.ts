import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsInt()
    @Min(0)
    price: number; // em centavos

    @IsInt()
    @Min(0)
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    category?: string;
}
