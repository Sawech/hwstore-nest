/**
 * HWstore — PSU Scorer
 * Weight table (sum = 100):
 *   powerFit         50  — right-sized for load (120–150% = ideal)
 *   efficiency       30  — 80+ tier
 *   pricePerformance 20  — price per watt
 */
import { Injectable } from '@nestjs/common';
import { BaseScorer } from './base.scorer';
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from '../../interfaces/build-state.interface';
import { ScoreBreakdown } from '../recommendation.types';
import {
  PsuSpecs,
  CpuSpecs,
  GpuSpecs,
} from '../../interfaces/specs.interfaces';

const EFFICIENCY_SCORE: Record<string, number> = {
  Titanium: 1.0,
  Platinum: 0.9,
  Gold: 0.75,
  Silver: 0.6,
  Bronze: 0.5,
  White: 0.3,
};

@Injectable()
export class PsuScorer extends BaseScorer {
  score(candidate: Composant, build: BuildState): ScoreBreakdown {
    const psuSpecs = candidate.specs as unknown as PsuSpecs;
    const breakdown: ScoreBreakdown = {};

    // Estimate system load
    let load = 100;
    if (build.cpu) load += (build.cpu.specs as unknown as CpuSpecs).tdp ?? 0;
    if (build.gpu) {
      const g = build.gpu.specs as unknown as GpuSpecs;
      load += g.tdp ?? Math.round(g.recommendedPsu * 0.75);
    }
    const required = load * 1.2;

    // Reward PSUs sized 120–150% of required load
    const ratio = psuSpecs.wattage / required;
    if (ratio >= 1.2 && ratio <= 1.5) {
      breakdown.powerFit = 50;
    } else if (ratio >= 1.0) {
      breakdown.powerFit = Math.round(50 * 0.7);
    } else {
      breakdown.powerFit = 0;
    }

    // Efficiency tier
    const effScore = EFFICIENCY_SCORE[psuSpecs.efficiency] ?? 0.3;
    breakdown.efficiency = Math.round(30 * effScore);

    // Price per watt: target ≤ €0.20/W for full score
    // const pricePerWatt = Number(candidate.price) / psuSpecs.wattage;
    // breakdown.pricePerformance = Math.round(20 * Math.min(1, 0.20 / pricePerWatt));

    return breakdown;
  }
}
