/**
 * HWstore — Category Entity
 */

import { SubCategory } from 'src/sub-category/sub-category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, unique: true })
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => SubCategory, (subcategory) => subcategory.category, {
    cascade: true,
  })
  subcategory: SubCategory[];

  @CreateDateColumn()
  createdAt: Date;
}
