/**
 * HWstore — PSU ↔ System Power Validator
 * Rules: PSU wattage vs total system load + 20% safety margin
 */
import { Injectable } from '@nestjs/common';
import { BaseValidator } from './base.validator';
import { BuildState } from '../../interfaces/build-state.interface';
import { CompatibilityIssue } from '../compatibility.types';
import {
  GpuSpecs,
  CpuSpecs,
  PsuSpecs,
} from '../../interfaces/specs.interfaces';

@Injectable()
export class PsuSystemValidator extends BaseValidator {
  private readonly SAFETY_MARGIN = 1.2; // wattage needed + 20% as safety margin
  private readonly BASE_SYSTEM_W = 100; // mobo + storage + fans baseline
  private readonly OVERSIZE_FACTOR = 2.5; // warn if PSU wattage > 2.5x required

  validate(build: BuildState): CompatibilityIssue[] {
    const { psu } = build;
    if (!psu) return this.ok();

    const psuSpecs = psu.specs as unknown as PsuSpecs;
    let estimatedLoad = this.BASE_SYSTEM_W;

    if (build.cpu) {
      const cpuSpecs = build.cpu.specs as unknown as CpuSpecs;
      estimatedLoad += cpuSpecs.tdp ?? 0;
    }
    if (build.gpu) {
      const gpuSpecs = build.gpu.specs as unknown as GpuSpecs;
      estimatedLoad +=
        gpuSpecs.tdp ?? Math.round(gpuSpecs.recommendedPsu * 0.75);
    }

    const requiredWattage = Math.ceil(estimatedLoad * this.SAFETY_MARGIN);
    const issues: CompatibilityIssue[] = [];

    if (psuSpecs.wattage < requiredWattage) {
      issues.push(
        ...this.error(
          'PSU_INSUFFICIENT_WATTAGE',
          `PSU ${psuSpecs.wattage}W is insufficient — system needs ~${requiredWattage}W (${estimatedLoad}W + 20% headroom)`,
          ['alimentation', 'gpu', 'processeur'],
        ),
      );
    } else if (psuSpecs.wattage > requiredWattage * this.OVERSIZE_FACTOR) {
      issues.push(
        ...this.warning(
          'PSU_SIGNIFICANTLY_OVERSIZED',
          `PSU ${psuSpecs.wattage}W may run at <40% load — consider a ${requiredWattage + 100}W unit for better efficiency`,
          ['alimentation'],
        ),
      );
    }

    return issues;
  }
}
