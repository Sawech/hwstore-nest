/**
 * HWstore — Compatibility Service (Orchestrator)
 * Runs all registered validators and produces a unified CompatibilityResult.
 */
import { Injectable } from '@nestjs/common';
import { BuildState } from '../interfaces/build-state.interface';
import { CompatibilityResult, CompatibilityIssue } from './compatibility.types';
import { CpuMotherboardValidator }  from './validators/cpu-motherboard.validator';
import { RamMotherboardValidator }  from './validators/ram-motherboard.validator';
import { GpuCaseValidator }         from './validators/gpu-case.validator';
import { PsuSystemValidator }       from './validators/psu-system.validator';
import { CoolerCpuValidator }       from './validators/cooler-cpu.validator';
import { MotherboardCaseValidator } from './validators/motherboard-case.validator';
import { BaseValidator }            from './validators/base.validator';

@Injectable()
export class CompatibilityService {
  private readonly validators: BaseValidator[];

  constructor(
    private readonly cpuMb:   CpuMotherboardValidator,
    private readonly ramMb:   RamMotherboardValidator,
    private readonly gpuCase: GpuCaseValidator,
    private readonly psuSys:  PsuSystemValidator,
    private readonly coolerCpu: CoolerCpuValidator,
    private readonly mbCase:  MotherboardCaseValidator,
  ) {
    this.validators = [
      this.cpuMb,
      this.ramMb,
      this.gpuCase,
      this.psuSys,
      this.coolerCpu,
      this.mbCase,
    ];
  }

  validate(build: BuildState): CompatibilityResult {
    const allIssues: CompatibilityIssue[] = this.validators
      .flatMap((v) => v.validate(build));

    const hasError = allIssues.some((i) => i.severity === 'error');

    // Score: start at 100, deduct per issue severity
    let score = 100;
    for (const issue of allIssues) {
      if (issue.severity === 'error')   score -= 40;
      if (issue.severity === 'warning') score -= 10;
    }
    score = Math.max(0, score);

    return {
      isCompatible: !hasError,
      score,
      issues: allIssues,
    };
  }
}
