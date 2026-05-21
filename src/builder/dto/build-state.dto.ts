/**
 * HWstore — Build State DTOs
 */
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class BuildStateDto {
  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  motherboardId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  cpuId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  gpuId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  ramId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  psuId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  caseId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  coolerId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  storageId?: number;
}
