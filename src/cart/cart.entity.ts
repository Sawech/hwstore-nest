import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Composant } from '../composants/composants.entity';
import { User } from 'src/user/user.entity';

export type CartStatus = 'active' | 'checked_out' | 'abandoned' | 'waiting';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  // @Column({ nullable: true, name: 'session_token', length: 128 })
  // sessionToken?: string;
  @Column({ nullable: true, unique: true, name: 'order_ref', length: 20 })
  orderRef: string;

  @Column({
    type: 'enum',
    enum: ['active', 'checked_out', 'abandoned', 'waiting'],
    default: 'active',
  })
  status: CartStatus;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];

  @Column('decimal', { precision: 14, scale: 2, name: 'total_price' })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Composant, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'composant_id' })
  composant: Composant;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2, name: 'unit_price' })
  unitPrice: number;
}
