/**
 * HWstore — Configurator Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ConfiguratorComponent } from './configurator-component.entity';
import { CalculateBuildDto } from './dto/calculate-build.dto';

@Injectable()
export class ConfiguratorService {
  constructor(
    @InjectRepository(ConfiguratorComponent)
    private readonly componentsRepo: Repository<ConfiguratorComponent>,
  ) {}

  findAll(type?: string): Promise<ConfiguratorComponent[]> {
    if (type) {
      return this.componentsRepo.find({ where: { type: type as any } });
    }
    return this.componentsRepo.find();
  }

  async calculate(dto: CalculateBuildDto) {
    const ids = [
      dto.boitierId,
      dto.processeurId,
      dto.cartemereId,
      dto.ramId,
      dto.stockageId,
      dto.gpuId,
      dto.alimentationId,
      dto.refroidissementId,
    ].filter((id): id is string => !!id);

    const components =
      ids.length > 0
        ? await this.componentsRepo.find({ where: { id: In(ids) } })
        : [];

    const total = components.reduce((sum, c) => sum + Number(c.price), 0);

    const estimatedWattage = components.reduce(
      (sum, c) => sum + (c.wattage ?? 0),
      0,
    );

    // Simple compatibility scoring
    let compatibilityScore = 100;
    const hasPsu = !!dto.alimentationId;
    if (hasPsu && estimatedWattage > 850) {
      compatibilityScore -= 20; // warn if over 850W without high-capacity PSU
    }

    return {
      total,
      components,
      estimatedWattage,
      compatibilityScore,
    };
  }
}
