import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class Item {
  @IsNumber()
  composantId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class CartDto {
  @IsInt()
  userId: number;

  @IsArray()
  items: Item[];

  @IsNumber()
  @Min(0)
  totalPrice: number;
}

export class AdminCartDto {
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
  search?: string;

  @IsOptional()
  @IsEnum(['active', 'checked_out', 'abandoned', 'waiting'])
  status?: string;
}
export class UpdateCartStatusDto {
  @IsEnum(['active', 'checked_out', 'abandoned', 'waiting'])
  status: string;
}

export class CartContextDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sessionToken?: string;
}
