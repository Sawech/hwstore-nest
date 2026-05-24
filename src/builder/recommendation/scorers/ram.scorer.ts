/**
 * HWstore — RAM Scorer  (v2)
 *
 * Weight table (sums to 100):
 *   ramTypeMatch   50  — DDR type match (was 40) — binary, most important
 *   futureProofing 50  — speed rating (was 35)
 *
 * Removed: capacityValue (GB per euro) — entirely gone.
 *
 * Score balancing strategy:
 *   - typeMatch: binary but generous baseline when no MB context (50% credit)
 *   - speed: smoothstep curve on MHz relative to platform ceiling
 *       DDR5 ceiling: 8000 MHz   DDR4 ceiling: 5333 MHz
 *       "Average" DDR5-5600 → ratio 0.70 → smoothstep(0.70) = 0.784 → 39pts
 *       "Enthusiast" DDR5-6000 → ratio 0.75 → 0.844 → 42pts
 *       "Top" DDR5-7200 → ratio 0.90 → 0.972 → 49pts
 *   - Combined: type(50) + speed(~40) = ~90 for typical good RAM → healthy scores
 *
 * Before / After example (Corsair DDR5-6000 32GB, AM5 board):
 *   Before: typeMatch=40, speed≈26 → raw=66
 *   After:  typeMatch=50, speed≈42 → raw=92
 */
import { Injectable } from '@nestjs/common';
import { BaseScorer } from './base.scorer';
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from '../../interfaces/build-state.interface';
import { ScoreBreakdown } from '../recommendation.types';
import { RamSpecs, MotherboardSpecs } from '../../interfaces/specs.interfaces';

/** smoothstep easing: S-curve 0→1 */
function smoothstep(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

/** Per-generation speed ceiling in MHz */
const SPEED_CEILING: Record<string, number> = {
  DDR5: 8000,
  DDR4: 5333,
  DDR3: 2666,
};

@Injectable()
export class RamScorer extends BaseScorer {
  score(candidate: Composant, build: BuildState): ScoreBreakdown {
    const ramSpecs   = candidate.specs as unknown as RamSpecs;
    const breakdown: ScoreBreakdown = {};

    // ── Type match ────────────────────────────────────────────────
    if (build.motherboard) {
      const mbSpecs = build.motherboard.specs as unknown as MotherboardSpecs;
      breakdown.ramTypeMatch = ramSpecs.type === mbSpecs.ramType ? 50 : 0;
    } else {
      // No MB context — neutral baseline (35/50 = 70%)
      breakdown.ramTypeMatch = 35;
    }

    // ── Speed: smoothstep curve relative to generation ceiling ────
    const ceiling   = SPEED_CEILING[ramSpecs.type] ?? 4000;
    const speedRatio = Math.min(1, (ramSpecs.speed ?? 3200) / ceiling);
    breakdown.futureProofing = Math.round(50 * smoothstep(speedRatio));

    return breakdown;
  }
}
