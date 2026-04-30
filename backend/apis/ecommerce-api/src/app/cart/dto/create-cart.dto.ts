import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsPositive,
    ValidateNested,
} from 'class-validator';

class CartItemDto {
    @IsInt()
    @IsPositive()
    product_id: number;

    @IsInt()
    @IsPositive()
    quantity: number;
}

export class CreateCartDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];
}
