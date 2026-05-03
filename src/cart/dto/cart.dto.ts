import { Type } from 'class-transformer';
import {
  isEnum,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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
