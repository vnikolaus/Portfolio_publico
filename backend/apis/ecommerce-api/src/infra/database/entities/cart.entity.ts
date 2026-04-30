// cart.entity.ts
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
    PENDING,
    PAID,
    SHIPPED,
    CANCELLED,
    FINISHED,
}

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid' })
    public_uuid: string;

    @Column('int') // total em centavos
    total: number;

    @Column({ type: 'enum', enum: CartStatus, default: CartStatus.PENDING })
    status: CartStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
        cascade: true,
    })
    items: CartItem[];
}
