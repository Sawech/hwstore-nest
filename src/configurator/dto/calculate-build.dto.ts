/**
 * HWstore — Configurator DTO
 */

import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CalculateBuildDto {
  @IsOptional()
  @IsString()
  boitierId?: string;

  @IsOptional()
  @IsString()
  processeurId?: string;

  @IsOptional()
  @IsString()
  cartemereId?: string;

  @IsOptional()
  @IsString()
  ramId?: string;

  @IsOptional()
  @IsString()
  stockageId?: string;

  @IsOptional()
  @IsString()
  gpuId?: string;

  @IsOptional()
  @IsString()
  alimentationId?: string;

  @IsOptional()
  @IsString()
  refroidissementId?: string;
}
