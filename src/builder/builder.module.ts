/**
 * HWstore — Builder Module
 * Registers all validators, scorers, services, and the Redis cache.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { Composant } from 'src/composants/composants.entity';

// Controller
import { BuilderController } from './builder.controller';

// Core services
import { BuildStateResolverService } from './build-state-resolver.service';
import { CompatibilityService }      from './compatibility/compatibility.service';
import { RecommendationService }     from './recommendation/recommendation.service';

// Validators
import { CpuMotherboardValidator }  from './compatibility/validators/cpu-motherboard.validator';
import { RamMotherboardValidator }  from './compatibility/validators/ram-motherboard.validator';
import { GpuCaseValidator }         from './compatibility/validators/gpu-case.validator';
import { PsuSystemValidator }       from './compatibility/validators/psu-system.validator';
import { CoolerCpuValidator }       from './compatibility/validators/cooler-cpu.validator';
import { MotherboardCaseValidator } from './compatibility/validators/motherboard-case.validator';

// Scorers
import { CpuScorer } from './recommendation/scorers/cpu.scorer';
import { GpuScorer } from './recommendation/scorers/gpu.scorer';
import { PsuScorer } from './recommendation/scorers/psu.scorer';
import { RamScorer } from './recommendation/scorers/ram.scorer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Composant]),
    CacheModule.register({
      ttl: 60,    // default 60 seconds
      max: 500,   // max items in memory cache
    }),
  ],
  controllers: [BuilderController],
  providers: [
    // Core
    BuildStateResolverService,
    CompatibilityService,
    RecommendationService,
    // Validators
    CpuMotherboardValidator,
    RamMotherboardValidator,
    GpuCaseValidator,
    PsuSystemValidator,
    CoolerCpuValidator,
    MotherboardCaseValidator,
    // Scorers
    CpuScorer,
    GpuScorer,
    PsuScorer,
    RamScorer,
  ],
  exports: [CompatibilityService, RecommendationService],
})
export class BuilderModule {}
