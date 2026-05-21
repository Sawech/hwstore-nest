/**
 * HWstore — Recommendations Query DTO
 */
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BuildStateDto } from './build-state.dto';

export class RecommendationsQueryDto extends BuildStateDto {
  @IsEnum([
    'boitier', 'processeur', 'carte-mere', 'ram',
    'stockage', 'gpu', 'alimentation', 'refroidissement',
  ])
  targetType: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
  limit?: number = 20;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  offset?: number = 0;
}
