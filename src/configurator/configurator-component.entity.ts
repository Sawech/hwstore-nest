/**
 * HWstore — Configurator Component Entity
 */

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type ComponentType =
  | 'boitier'
  | 'processeur'
  | 'carte-mere'
  | 'ram'
  | 'stockage'
  | 'gpu'
  | 'alimentation'
  | 'refroidissement';

@Entity('configurator_components')
export class ConfiguratorComponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  type: ComponentType;

  @Column({ length: 255 })
  name: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  tags: string[];

  @Column({ nullable: true, default: 0 })
  wattage: number;
}
