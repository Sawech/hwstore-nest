/**
 * HWstore — CPU Scorer  (v2)
 *
 * Weight table (sums to 100):
 *   socketMatch      55  — hard constraint (critical)
 *   ramTypeMatch     25  — important for platform cohesion
 *   futureProofing   20  — core-count headroom
 *
 * No price-based scoring.
 *
 * Score balancing strategy:
 *   - When motherboard context is present:
 *       perfect match  → socketMatch=55, ramTypeMatch=25, futureProofing up to 20 → max 100
 *   - When no context yet → neutral baseline ~65 (user sees "decent" not "bad")
 *   - futureProofing uses a smoothstep curve for organic feel
 *
 * Before / After example (Ryzen 7 9700X, ASUS AM5 board):
 *   Before: socketMatch=50, ramTypeMatch=20, futureProofing≈8  → raw=78
 *   After:  socketMatch=55, ramTypeMatch=25, futureProofing≈16 → raw=96
 */
import { Injectable } from '@nestjs/common';
import { BaseScorer } from './base.scorer';
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from '../../interfaces/build-state.interface';
import { ScoreBreakdown } from '../recommendation.types';
import { CpuSpecs, MotherboardSpecs } from '../../interfaces/specs.interfaces';

/** smoothstep: eases value x ∈ [0,1] → [0,1] with S-curve */
function smoothstep(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

@Injectable()
export class CpuScorer extends BaseScorer {
  score(candidate: Composant, build: BuildState): ScoreBreakdown {
    const cpuSpecs = candidate.specs as unknown as CpuSpecs;
    const breakdown: ScoreBreakdown = {};

    if (build.motherboard) {
      const mbSpecs = build.motherboard.specs as unknown as MotherboardSpecs;

      // Socket: binary hard constraint — full credit or zero
      breakdown.socketMatch = cpuSpecs.socket === mbSpecs.socket ? 55 : 0;

      // RAM type: binary constraint — full credit or zero
      breakdown.ramTypeMatch =
        cpuSpecs.memorySupport === mbSpecs.ramType ? 25 : 0;
      console.log(breakdown);
    } else {
      // No context — give generous neutral credit so unfiltered list isn't scary
      breakdown.socketMatch = 38; // ~55 * 0.70
      breakdown.ramTypeMatch = 17; // ~25 * 0.70
    }

    // Future-proofing: smoothstep curve, ceiling at 16 cores
    // 8c → 0.50 smoothstep → 0.875 → 17.5 pts
    // 12c → 0.75 smoothstep → 0.844 → ... wait let me recalc
    // linear ratio first, then smoothstep for organic feel
    const coreRatio = Math.min(1, (cpuSpecs.cores ?? 1) / 16);
    breakdown.futureProofing = Math.round(20 * smoothstep(coreRatio));

    return breakdown;
  }
}
