/**
 * HWstore — Product Entity (PostgreSQL / TypeORM)
 */

import { SubCategory } from 'src/sub-category/sub-category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 100 })
  brand: string;

  @ManyToOne(() => SubCategory, (subcategory) => subcategory.products, {
    cascade: true,
  })
  subcategory: number;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column('float', { default: 0 })
  rating: number;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  images: string[];

  @Column({ nullable: true, length: 20 })
  badge: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  shortDescription: string;

  @Column('jsonb', { default: {} })
  specs: Record<string, string | number>;

  @Column({ type: 'jsonb', default: {} })
  tags: Record<string, string[]>;

  @Column('int', { default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
