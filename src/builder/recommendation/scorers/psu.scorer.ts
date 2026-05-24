/**
 * HWstore — PSU Scorer  (v2)
 *
 * Weight table (sums to 100):
 *   powerFit    60  — right-sizing (was 50)
 *   efficiency  40  — 80+ tier (was 30)
 *
 * Removed: pricePerformance (price per watt) — entirely gone.
 *
 * Score balancing strategy:
 *   powerFit curve (Gaussian bell on ratio):
 *     - Sweet spot: PSU = 130–160% of required load → 60 pts
 *     - Acceptable:  110–200% → graceful partial score
 *     - Too small:   <100%   → 0
 *     - Too large:   >200%   → penalty (running too inefficient)
 *
 *   efficiency:
 *     Titanium=40, Platinum=36, Gold=30, Silver=24, Bronze=20, White=12
 *     (calibrated so Gold = 30/40 = 75%, still a good score)
 *
 * Before / After example (RM850x 850W, Ryzen 7 9700X 65W + RTX 4080S 320W):
 *   Load ≈ 100+65+320=485W, required ≈ 582W
 *   ratio = 850/582 = 1.46 → sweet spot
 *   Before: powerFit=50, efficiency=23, pricePerf≈0 → raw≈73
 *   After:  powerFit=60, efficiency=30              → raw=90
 */
import { Injectable } from '@nestjs/common';
import { BaseScorer } from './base.scorer';
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from '../../interfaces/build-state.interface';
import { ScoreBreakdown } from '../recommendation.types';
import { PsuSpecs, CpuSpecs, GpuSpecs } from '../../interfaces/specs.interfaces';

const EFFICIENCY_SCORE: Record<string, number> = {
  Titanium:  40,
  Platinum:  36,
  Gold:      30,
  Silver:    24,
  Bronze:    20,
  White:     12,
};

/**
 * Bell-shaped power-fit curve.
 * ratio = psuWattage / requiredWattage
 * Peak (1.0) at ratio 1.30–1.60.
 * Drops gracefully on both sides.
 */
function powerFitCurve(ratio: number): number {
  if (ratio < 1.0) return 0;                          // undersized → incompatible anyway
  if (ratio >= 1.20 && ratio <= 1.70) return 1.0;     // sweet spot → full score
  if (ratio > 1.70 && ratio <= 2.20) {
    // Slightly oversized — partial score (better than undersized)
    return 0.85 - 0.30 * ((ratio - 1.70) / 0.50);
  }
  if (ratio > 2.20) return 0.55;                      // very oversized — still valid, just wasteful
  // ratio 1.0–1.20: acceptable but tight
  return 0.70 + 0.30 * ((ratio - 1.0) / 0.20);
}

@Injectable()
export class PsuScorer extends BaseScorer {
  private readonly BASE_W  = 100;   // mobo + storage + fans baseline

  score(candidate: Composant, build: BuildState): ScoreBreakdown {
    const psuSpecs   = candidate.specs as unknown as PsuSpecs;
    const breakdown: ScoreBreakdown = {};

    // ── Estimate system load ─────────────────────────────────────
    let load = this.BASE_W;
    if (build.cpu) {
      load += (build.cpu.specs as unknown as CpuSpecs).tdp ?? 0;
    }
    if (build.gpu) {
      const g = build.gpu.specs as unknown as GpuSpecs;
      load += g.tdp ?? Math.round(g.recommendedPsu * 0.75);
    }

    // Required = load + 20% safety
    const required = load * 1.2;
    const ratio    = psuSpecs.wattage / required;

    breakdown.powerFit = Math.round(60 * powerFitCurve(ratio));

    // ── Efficiency tier ──────────────────────────────────────────
    breakdown.efficiency = EFFICIENCY_SCORE[psuSpecs.efficiency] ?? 12;

    return breakdown;
  }
}
