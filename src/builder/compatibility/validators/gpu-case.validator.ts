/**
 * HWstore — GPU ↔ Case Validator
 * Rules: GPU length vs case max GPU length
 */
import { Injectable } from '@nestjs/common';
import { BaseValidator } from './base.validator';
import { BuildState } from '../../interfaces/build-state.interface';
import { CompatibilityIssue } from '../compatibility.types';
import { GpuSpecs, CaseSpecs } from '../../interfaces/specs.interfaces';

@Injectable()
export class GpuCaseValidator extends BaseValidator {
  private readonly TIGHT_FIT_THRESHOLD_MM = 20;

  validate(build: BuildState): CompatibilityIssue[] {
    const { gpu, case: pcCase } = build;
    if (!gpu || !pcCase) return this.ok();

    const gpuSpecs  = gpu.specs   as unknown as GpuSpecs;
    const caseSpecs = pcCase.specs as unknown as CaseSpecs;
    const issues: CompatibilityIssue[] = [];

    if (gpuSpecs.lengthMm > caseSpecs.maxGpuLength) {
      issues.push(...this.error(
        'GPU_TOO_LONG_FOR_CASE',
        `GPU is ${gpuSpecs.lengthMm}mm — case only supports up to ${caseSpecs.maxGpuLength}mm`,
        ['gpu', 'case'],
      ));
      return issues;
    }

    const clearance = caseSpecs.maxGpuLength - gpuSpecs.lengthMm;
    if (clearance < this.TIGHT_FIT_THRESHOLD_MM) {
      issues.push(...this.warning(
        'GPU_TIGHT_FIT',
        `GPU (${gpuSpecs.lengthMm}mm) leaves only ${clearance}mm of clearance — verify cable routing`,
        ['gpu', 'case'],
      ));
    }

    return issues;
  }
}
