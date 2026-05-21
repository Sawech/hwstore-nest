/**
 * HWstore — CPU Scorer
 * Weight table (must sum to 100):
 *   socketMatch      50  — critical hard constraint
 *   ramTypeMatch     20  — important for performance
 *   futureProofing   15  — core count
 *   pricePerformance 15  — price per thread
 */
import { Injectable } from '@nestjs/common';
import { BaseScorer } from './base.scorer';
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from '../../interfaces/build-state.interface';
import { ScoreBreakdown } from '../recommendation.types';
import { CpuSpecs, MotherboardSpecs } from '../../interfaces/specs.interfaces';

@Injectable()
export class CpuScorer extends BaseScorer {
  score(candidate: Composant, build: BuildState): ScoreBreakdown {
    const cpuSpecs = candidate.specs as unknown as CpuSpecs;
    const breakdown: ScoreBreakdown = {};

    if (build.motherboard) {
      const mbSpecs = build.motherboard.specs as unknown as MotherboardSpecs;
      breakdown.socketMatch = cpuSpecs.socket === mbSpecs.socket ? 50 : 0;
      breakdown.ramTypeMatch =
        cpuSpecs.memorySupport === mbSpecs.ramType ? 20 : 0;
    } else {
      // No context yet — give partial neutral credit
      breakdown.socketMatch = 25;
      breakdown.ramTypeMatch = 10;
    }

    // Future-proofing: normalise to 16-core ceiling
    const coreRatio = Math.min(1, (cpuSpecs.cores ?? 1) / 16);
    breakdown.futureProofing = Math.round(15 * coreRatio);

    // Price-per-thread: ≤ €20/thread = max score
    // const pricePerThread = Number(candidate.price) / (cpuSpecs.threads ?? 1);
    // const ppRatio = Math.max(0, 1 - pricePerThread / 20);
    // breakdown.pricePerformance = Math.round(15 * ppRatio);

    return breakdown;
  }
}
