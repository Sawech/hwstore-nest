import { Category } from 'src/category/category.entity';
import { Composant } from 'src/composants/composants.entity';
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

  @OneToMany(() => Composant, (composant) => composant.subcategory)
  composants: number[];
}
