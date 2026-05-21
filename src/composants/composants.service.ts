/**
 * HWstore — Composants Service
 */

import { Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Composant, ComposantType } from './composants.entity';
import {
  AdminCreateComposantDto,
  AdminComposantDto,
  AdminUpdateComposantDto,
  ComposantsDto,
} from './dto/composants.dto';
import { AppService } from 'src/app.service';

@Injectable()
export class ComposantsService {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(Composant)
    private readonly composantsRepo: Repository<Composant>,
  ) {}

  async findAll(query: ComposantsDto) {
    const {
      subcategory,
      brand,
      priceMin,
      priceMax,
      tags,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query;

    const qb = this.composantsRepo
      .createQueryBuilder('composant')
      .andWhere('composant.stock > 0');

    if (subcategory) {
      qb.andWhere('composant.subcategoryId = :subcategory', { subcategory });
    }
    if (brand) {
      qb.andWhere('LOWER(composant.brand) LIKE LOWER(:brand)', {
        brand: `%${brand}%`,
      });
    }
    if (priceMin !== undefined) {
      qb.andWhere('composant.price >= :priceMin', { priceMin });
    }
    if (priceMax !== undefined) {
      qb.andWhere('composant.price <= :priceMax', { priceMax });
    }
    if (tags && Object.keys(tags).length > 0) {
      Object.entries(tags).forEach(([group, values], i) => {
        if (values.length === 0) return;
        qb.andWhere(`composant.tags -> :group${i} ?| array[:...values${i}]`, {
          [`group${i}`]: group,
          [`values${i}`]: values,
        });
      });
    }

    const allowedSort = ['price', 'rating', 'createdAt', 'name'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`composant.${safeSort}`, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Composant> {
    const composant = await this.composantsRepo.findOne({
      where: { id },
      relations: ['subcategory'],
    });
    if (!composant) {
      throw new NotFoundException(`Composant "${id}" introuvable.`);
    }
    return composant;
  }

  async findType(type: string): Promise<Composant[]> {
    const composants = await this.composantsRepo.find({
      where: { type: type as ComposantType },
    });
    if (!composants) {
      throw new NotFoundException(`Composant  introuvable.`);
    }
    return composants;
  }

  async adminFindAll(query: AdminComposantDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    const qb = this.composantsRepo
      .createQueryBuilder('composant')
      .leftJoinAndSelect('composant.subcategory', 'subcategory')
      .orderBy('composant.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.search)
      qb.andWhere('composant.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    if (query.subcategory)
      qb.andWhere('composant.subcategoryId = :sub', { sub: query.subcategory });
    if (query.tags && Object.keys(query.tags).length > 0) {
      Object.entries(query.tags).forEach(([group, values], i) => {
        if (values.length === 0) return;
        qb.andWhere(`composant.tags -> :group${i} ?| array[:...values${i}]`, {
          [`group${i}`]: group,
          [`values${i}`]: values,
        });
      });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async adminFindOne(id: number) {
    return this.composantsRepo.findOneOrFail({
      where: { id },
      relations: ['subcategory'],
    });
  }

  async create(dto: AdminCreateComposantDto) {
    const slug =
      dto.slug ??
      dto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const composant = this.composantsRepo.create({
      name: dto.name,
      slug,
      brand: dto.brand,
      price: dto.price,
      description: dto.description,
      images: dto.images ?? [],
      specs: dto.specs ?? {},
      tags: dto.tags ?? {},
      stock: dto.stock ?? 0,
      type: (dto.type as ComposantType) ?? 'other',
      subcategory: dto.subcategory ?? undefined,
    });

    return this.composantsRepo.save(composant);
  }

  async update(id: number, dto: AdminUpdateComposantDto) {
    const composant = await this.composantsRepo.findOne({
      where: { id },
      relations: ['subcategory'],
    });
    if (!composant) throw new NotFoundException(`Composant #${id} introuvable`);

    if (dto.name) composant.name = dto.name;
    if (dto.brand) composant.brand = dto.brand;
    if (dto.price) composant.price = dto.price;
    if (dto.description) composant.description = dto.description;
    if (dto.images) composant.images = [...composant.images, ...dto.images];
    if (dto.specs) composant.specs = dto.specs;
    if (dto.tags) composant.tags = dto.tags;
    if (dto.stock !== undefined) composant.stock = dto.stock;
    if (dto.type !== undefined) composant.type = dto.type as ComposantType;
    if (dto.subcategory) composant.subcategory = dto.subcategory;

    return this.composantsRepo.save(composant);
  }

  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploading file:', file.originalname);
    const result = await this.appService.upload(file);
    return { url: result.secure_url };
  }

  async remove(id: string) {
    await this.composantsRepo.delete(id);
    return { message: 'Composant supprimé avec succès' };
  }
}
