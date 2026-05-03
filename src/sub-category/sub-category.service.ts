import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from './sub-category.entity';
import { SubCategoryDto } from './dto/sub-category.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async getAll() {
    return this.subCategoryRepository.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    return this.subCategoryRepository.findBy({
      id,
    });
  }

  async adminGetAll() {
    return this.subCategoryRepository.find({ relations: ['category'] });
  }

  async create(dto: SubCategoryDto) {
    const subCategory = this.subCategoryRepository.create({
      name: dto.name,
      slug: dto.slug,
      image: dto.image ?? '',
      description: dto.description ?? '',
      tags: dto.tags ?? {},
      category: { id: dto.category },
    });
    return this.subCategoryRepository.save(subCategory);
  }

  async update(id: number, dto: SubCategoryDto) {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!subCategory) return { message: 'Sous-catégorie introuvable' };

    if (dto.name) subCategory.name = dto.name;
    if (dto.slug) subCategory.slug = dto.slug;
    if (dto.image) subCategory.image = dto.image;
    if (dto.description !== undefined)
      subCategory.description = dto.description;
    if (dto.tags !== undefined) subCategory.tags = dto.tags;
    await this.subCategoryRepository.save(subCategory);
    return { message: 'Sous-catégorie enregistré' };
  }

  async remove(id: number) {
    await this.subCategoryRepository.delete(id);
    return { message: 'Sous-categorie supprimée avec succès' };
  }
}
