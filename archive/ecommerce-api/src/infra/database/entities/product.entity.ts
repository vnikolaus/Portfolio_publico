// product.entity.ts
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ unique: true })
    sku: string;

    @Column('int') // preço em centavos
    price: number;

    @Column({ default: 0 })
    stock: number;

    @Column({ nullable: true })
    category?: string;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relação com CartItem (produto pode estar em muitos pedidos)
    @OneToMany(() => CartItem, (cartItem) => cartItem.product)
    cartItems: CartItem[];
}
