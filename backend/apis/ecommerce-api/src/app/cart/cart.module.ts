import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
    imports: [DatabaseModule],
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule {}
