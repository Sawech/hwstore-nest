/**
 * HWstore — Get Composants Query DTO
 */

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ComposantsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  subcategory?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      if (typeof parsed !== 'object' || Array.isArray(parsed)) return undefined;
      return Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [k, Array.isArray(v) ? v : [v]]),
      );
    } catch {
      return undefined;
    }
  })
  tags?: Record<string, string[]>;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 12;

  @IsOptional()
  @IsString()
  @IsIn(['price', 'rating', 'createdAt', 'name'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsEnum([
    'boitier',
    'processeur',
    'carte-mere',
    'ram',
    'stockage',
    'gpu',
    'alimentation',
    'refroidissement',
    'other',
  ])
  type?: string;
}

export class AdminComposantDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  subcategory?: number;

  @IsOptional()
  @IsObject()
  tags?: Record<string, string[]>;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsEnum([
    'boitier',
    'processeur',
    'carte-mere',
    'ram',
    'stockage',
    'gpu',
    'alimentation',
    'refroidissement',
    'other',
  ])
  type?: string;
}

export class AdminCreateComposantDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  brand: string;

  @IsOptional()
  @IsNumber()
  subcategory?: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsObject()
  tags?: Record<string, string[]>;

  @IsOptional()
  @IsObject()
  specs?: Record<string, string | number>;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsEnum([
    'boitier',
    'processeur',
    'carte-mere',
    'ram',
    'stockage',
    'gpu',
    'alimentation',
    'refroidissement',
    'other',
  ])
  type?: string;
}

export class AdminUpdateComposantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  subcategory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsObject()
  tags?: Record<string, string[]>;

  @IsOptional()
  @IsObject()
  specs?: Record<string, string | number>;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsEnum([
    'boitier',
    'processeur',
    'carte-mere',
    'ram',
    'stockage',
    'gpu',
    'alimentation',
    'refroidissement',
    'other',
  ])
  type?: string;
}
