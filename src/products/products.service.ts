/**
 * HWstore — Products Service
 */

import { Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import {
  AdminCreateProductDto,
  AdminProductDto,
  AdminUpdateProductDto,
  ProductsDto,
} from './dto/products.dto';
import { AppService } from 'src/app.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async findAll(query: ProductsDto) {
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

    const qb = this.productsRepo
      .createQueryBuilder('product')
      .andWhere('product.stock > 0');

    if (subcategory) {
      qb.andWhere('product.subcategoryId = :subcategory', { subcategory });
    }
    if (brand) {
      qb.andWhere('LOWER(product.brand) LIKE LOWER(:brand)', {
        brand: `%${brand}%`,
      });
    }
    if (priceMin !== undefined) {
      qb.andWhere('product.price >= :priceMin', { priceMin });
    }
    if (priceMax !== undefined) {
      qb.andWhere('product.price <= :priceMax', { priceMax });
    }
    if (tags && Object.keys(tags).length > 0) {
      Object.entries(tags).forEach(([group, values], i) => {
        if (values.length === 0) return;
        qb.andWhere(`product.tags -> :group${i} ?| array[:...values${i}]`, {
          [`group${i}`]: group,
          [`values${i}`]: values,
        });
      });
    }

    const allowedSort = ['price', 'rating', 'createdAt', 'name'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`product.${safeSort}`, order);

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

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['subcategory'],
    });
    if (!product) {
      throw new NotFoundException(`Produit "${id}" introuvable.`);
    }
    return product;
  }

  async adminFindAll(query: AdminProductDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    const qb = this.productsRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subcategory', 'subcategory')
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.search)
      qb.andWhere('product.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    if (query.subcategory)
      qb.andWhere('product.subcategoryId = :sub', { sub: query.subcategory });
    if (query.tags && Object.keys(query.tags).length > 0) {
      Object.entries(query.tags).forEach(([group, values], i) => {
        if (values.length === 0) return;
        qb.andWhere(`product.tags -> :group${i} ?| array[:...values${i}]`, {
          [`group${i}`]: group,
          [`values${i}`]: values,
        });
      });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async adminFindOne(id: number) {
    return this.productsRepo.findOneOrFail({
      where: { id },
      relations: ['subcategory'],
    });
  }

  async create(dto: AdminCreateProductDto) {
    const slug =
      dto.slug ??
      dto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    console.log('dto.images', dto.images);

    const product = this.productsRepo.create({
      name: dto.name,
      slug,
      brand: dto.brand,
      price: dto.price,
      description: dto.description,
      images: dto.images ?? [],
      specs: dto.specs ?? {},
      tags: dto.tags ?? {},
      stock: dto.stock ?? 0,
      subcategory: dto.subcategory ?? undefined,
    });

    return this.productsRepo.save(product);
  }

  async update(id: number, dto: AdminUpdateProductDto) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['subcategory'],
    });
    if (!product) throw new NotFoundException(`Produit #${id} introuvable`);

    if (dto.name) product.name = dto.name;
    if (dto.brand) product.brand = dto.brand;
    if (dto.price) product.price = dto.price;
    if (dto.description) product.description = dto.description;
    if (dto.images) product.images = [...product.images, ...dto.images];
    if (dto.specs) product.specs = dto.specs;
    if (dto.tags) product.tags = dto.tags;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.subcategory) product.subcategory = dto.subcategory;

    return this.productsRepo.save(product);
  }

  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploading file:', file.originalname);
    const result = await this.appService.upload(file);
    return { url: result.secure_url };
  }

  async remove(id: string) {
    await this.productsRepo.delete(id);
    return { message: 'Composant supprimé avec succès' };
  }
}
