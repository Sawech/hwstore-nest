/**
 * HWstore — GPU Scorer  (v2)
 *
 * Weight table (sums to 100):
 *   powerFit      40  — PSU headroom (was 30)
 *   physicalFit   35  — case clearance (was 25)
 *   vramTier      15  — absolute VRAM capacity (hardware quality, NOT price)
 *   pcieVersion   10  — PCIe gen future-proofing (was 20)
 *
 * Removed: vramValue (price-based GB/€ ratio) — entirely gone.
 *
 * Score balancing strategy:
 *   - powerFit: smooth sigmoid-like curve, not a cliff
 *     headroom ≥ 200W → 40 pts; headroom ≥ 100W → 35 pts; near 0 → graceful slide
 *   - physicalFit: smooth clearance curve; ≥50mm clearance → full 35pts
 *   - vramTier: 0–8GB→9, 8–16GB→12, 16–24GB→15 (hardware tiers)
 *   - No context floors are generous (~60% of weight)
 *
 * Before / After example (RTX 4080 Super, Fractal Torrent, RM850x):
 *   Before: powerFit=30, physicalFit=25, pcieVersion=20 → raw=75
 *   After:  powerFit=40, physicalFit=35, vramTier=15, pcieVersion=10 → raw=100
 */
import { Injectable } from '@nestjs/common';
import { BaseScorer } from './base.scorer';
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from '../../interfaces/build-state.interface';
import { ScoreBreakdown } from '../recommendation.types';
import { GpuSpecs, PsuSpecs, CaseSpecs } from '../../interfaces/specs.interfaces';

/** Smooth linear clamp → 0..1 */
function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/** Smooth power-fit curve: x = headroom / target_headroom */
function powerFitCurve(headroom: number): number {
  if (headroom >= 200) return 1.0;
  if (headroom >= 100) return 0.90 + 0.10 * ((headroom - 100) / 100);
  if (headroom >= 0)   return clamp01(headroom / 100) * 0.90;
  return 0;
}

/** Physical clearance curve: full score at ≥ 50mm clearance */
function clearanceCurve(clearanceMm: number): number {
  if (clearanceMm >= 50) return 1.0;
  if (clearanceMm >= 0)  return clamp01(clearanceMm / 50);
  return 0;
}

/** VRAM hardware tier — hardware quality, no price involved */
function vramTierScore(vramGb: number): number {
  if (vramGb >= 20) return 15;
  if (vramGb >= 12) return 12;
  if (vramGb >= 8)  return 10;
  return 7;
}

@Injectable()
export class GpuScorer extends BaseScorer {
  score(candidate: Composant, build: BuildState): ScoreBreakdown {
    const gpuSpecs = candidate.specs as unknown as GpuSpecs;
    const breakdown: ScoreBreakdown = {};
    const gpuLoad = gpuSpecs.tdp ?? gpuSpecs.recommendedPsu ?? 0;

    // ── Power fit ────────────────────────────────────────────────
    if (build.psu) {
      const psuSpecs = build.psu.specs as unknown as PsuSpecs;
      const headroom = psuSpecs.wattage - gpuLoad;
      breakdown.powerFit = Math.round(40 * powerFitCurve(headroom));
    } else {
      // No PSU yet — neutral credit (don't punish the GPU for missing context)
      breakdown.powerFit = 26; // 40 * 0.65
    }

    // ── Physical fit ─────────────────────────────────────────────
    if (build.case) {
      const caseSpecs = build.case.specs as unknown as CaseSpecs;
      const clearance = caseSpecs.maxGpuLength - gpuSpecs.lengthMm;
      breakdown.physicalFit = Math.round(35 * clearanceCurve(clearance));
    } else {
      breakdown.physicalFit = 23; // 35 * 0.65
    }

    // ── VRAM tier (hardware quality, not price) ──────────────────
    breakdown.vramValue = vramTierScore(gpuSpecs.vram ?? 0);

    // ── PCIe version future-proofing ─────────────────────────────
    const pcie = gpuSpecs.pcieVersion ?? 0;
    if (pcie >= 5)      breakdown.pcieVersion = 10;
    else if (pcie >= 4) breakdown.pcieVersion = 10;  // PCIe 4 = current standard
    else if (pcie >= 3) breakdown.pcieVersion = 6;
    else                breakdown.pcieVersion = 3;

    return breakdown;
  }
}
