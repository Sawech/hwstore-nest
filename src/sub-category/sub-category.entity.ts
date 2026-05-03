import { Category } from 'src/category/category.entity';
import { Product } from 'src/products/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subcategory')
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'jsonb', default: {} })
  tags: Record<string, string[]>;

  @ManyToOne(() => Category, (category) => category.subcategory, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToMany(() => Product, (product) => product.subcategory)
  products: number[];
}
