/**
 * HWstore — GPU Scorer
 * Weight table (sum = 100):
 *   powerFit      30  — PSU can handle it safely
 *   physicalFit   25  — fits inside the case
 *   vramValue     25  — VRAM per euro
 *   pcieVersion   20  — newer = future-proof
 */
import { Injectable } from '@nestjs/common';
import { BaseScorer } from './base.scorer';
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from '../../interfaces/build-state.interface';
import { ScoreBreakdown } from '../recommendation.types';
import {
  GpuSpecs,
  PsuSpecs,
  CaseSpecs,
} from '../../interfaces/specs.interfaces';

@Injectable()
export class GpuScorer extends BaseScorer {
  score(candidate: Composant, build: BuildState): ScoreBreakdown {
    const gpuSpecs = candidate.specs as unknown as GpuSpecs;
    const breakdown: ScoreBreakdown = {};

    // PSU fit
    if (build.psu) {
      const psuSpecs = build.psu.specs as unknown as PsuSpecs;
      const gpuLoad = gpuSpecs.tdp ?? gpuSpecs.recommendedPsu;
      const headroom = psuSpecs.wattage - gpuLoad;
      breakdown.powerFit =
        headroom >= 150
          ? 30
          : headroom >= 0
            ? Math.round(30 * (headroom / 150))
            : 0;
    } else {
      breakdown.powerFit = 15;
    }

    // Physical fit
    if (build.case) {
      const caseSpecs = build.case.specs as unknown as CaseSpecs;
      const clearance = caseSpecs.maxGpuLength - gpuSpecs.lengthMm;
      breakdown.physicalFit =
        clearance >= 20
          ? 25
          : clearance >= 0
            ? Math.round(25 * (clearance / 20))
            : 0;
    } else {
      breakdown.physicalFit = 12;
    }

    // VRAM value: normalise at 0.05 VRAM GB per euro
    // const vramPerEuro = gpuSpecs.vram / Number(candidate.price);
    // breakdown.vramValue = Math.round(25 * Math.min(1, vramPerEuro / 0.05));

    // PCIe version future-proofing
    breakdown.pcieVersion = (gpuSpecs.pcieVersion ?? 0) >= 4 ? 20 : 10;

    return breakdown;
  }
}
