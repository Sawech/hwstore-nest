/**
 * HWstore — Category Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import {
  AdminCategoryDto,
  AdminCreateCategoryDto,
  AdminUpdateCategoryDto,
} from './dto/category.dto';

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(): Promise<{ data: Category[] }> {
    const data = await this.categoryRepo.find({
      order: { name: 'ASC' },
      relations: { subcategory: true },
    });
    return { data };
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { slug } });
    if (!category)
      throw new NotFoundException(`Catégorie "${slug}" introuvable`);
    return category;
  }

  async adminFindAll(query: AdminCategoryDto) {
    const { page = 1, limit = 12 } = query;
    const [data, total] = await this.categoryRepo.findAndCount({
      relations: ['subcategory'],
      order: { ['name']: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async adminCreate(dto: AdminCreateCategoryDto) {
    const slug = dto.slug ?? toSlug(dto.name);

    const category = this.categoryRepo.create({
      name: dto.name,
      slug,
      description: dto.description,
      image: dto.image,
    });

    return this.categoryRepo.save(category);
  }

  async adminUpdate(id: number, dto: AdminUpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['subcategory'],
    });

    if (!category) return;

    if (dto.name) category.name = dto.name;
    if (dto.slug) category.slug = dto.slug;
    if (dto.description !== undefined) category.description = dto.description;
    if (dto.image !== undefined) category.image = dto.image;

    return this.categoryRepo.save(category);
  }

  async adminRemove(id: number) {
    await this.categoryRepo.findOne({
      where: { id },
      relations: ['subcategory'],
    });
    await this.categoryRepo.delete(id);
    return { message: 'Catégorie supprimée avec succès' };
  }
}
