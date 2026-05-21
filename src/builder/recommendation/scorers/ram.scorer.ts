/**
 * HWstore — RAM Scorer
 * Weight table (sum = 100):
 *   typeMatch    40  — DDR type matches motherboard
 *   speed        35  — higher speed = better
 *   capacityValue 25 — GB per euro
 */
import { Injectable } from '@nestjs/common';
import { BaseScorer } from './base.scorer';
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from '../../interfaces/build-state.interface';
import { ScoreBreakdown } from '../recommendation.types';
import { RamSpecs, MotherboardSpecs } from '../../interfaces/specs.interfaces';

@Injectable()
export class RamScorer extends BaseScorer {
  score(candidate: Composant, build: BuildState): ScoreBreakdown {
    const ramSpecs = candidate.specs as unknown as RamSpecs;
    const breakdown: ScoreBreakdown = {};

    // Type match
    if (build.motherboard) {
      const mbSpecs = build.motherboard.specs as unknown as MotherboardSpecs;
      breakdown.ramTypeMatch = ramSpecs.type === mbSpecs.ramType ? 40 : 0;
    } else {
      breakdown.ramTypeMatch = 20;
    }

    // Speed: normalise DDR5 at 8000 MHz ceiling, DDR4 at 4000 MHz ceiling
    const ceiling = ramSpecs.type === 'DDR5' ? 8000 : 4000;
    const speedRatio = Math.min(1, (ramSpecs.speed ?? 3200) / ceiling);
    breakdown.futureProofing = Math.round(35 * speedRatio);

    // Capacity value: GB per euro, normalise at 0.5 GB/€
    // const gbPerEuro = (ramSpecs.capacity * (ramSpecs.sticks ?? 1)) / Number(candidate.price);
    // breakdown.pricePerformance = Math.round(25 * Math.min(1, gbPerEuro / 0.5));

    return breakdown;
  }
}
