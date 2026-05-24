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
import { PsuCaseValidator }         from './validators/psu-case.validator';
import { CoolerCpuValidator }       from './validators/cooler-cpu.validator';
import { MotherboardCaseValidator } from './validators/motherboard-case.validator';
import { BaseValidator }            from './validators/base.validator';

@Injectable()
export class CompatibilityService {
  private readonly validators: BaseValidator[];

  constructor(
    private readonly cpuMb:    CpuMotherboardValidator,
    private readonly ramMb:    RamMotherboardValidator,
    private readonly gpuCase:  GpuCaseValidator,
    private readonly psuSys:   PsuSystemValidator,
    private readonly psuCase:  PsuCaseValidator,
    private readonly coolerCpu: CoolerCpuValidator,
    private readonly mbCase:   MotherboardCaseValidator,
  ) {
    this.validators = [
      this.cpuMb,
      this.ramMb,
      this.gpuCase,
      this.psuSys,
      this.psuCase,
      this.coolerCpu,
      this.mbCase,
    ];
  }

  validate(build: BuildState): CompatibilityResult {
    const allIssues: CompatibilityIssue[] = this.validators
      .flatMap((v) => v.validate(build));

    const errors   = allIssues.filter((i) => i.severity === 'error');
    const warnings = allIssues.filter((i) => i.severity === 'warning');
    const hasError = errors.length > 0;

    /**
     * Scoring formula (v2):
     *   Base:    100
     *   Errors:  −35 each  (hard incompatibility — keeps compatible builds above 65)
     *   Warnings:  −7 each  (advisory — warning-only builds stay ≥ 79)
     *
     * Compatible-build floors:
     *   0 issues            → 100
     *   warnings only       → max(85, deducted score)   — never below 85 for compatible
     *   errors present      → max(0,  deducted score)   — no floor, errors are real
     *
     * This produces realistic ranges:
     *   Perfect build     → 100
     *   1 warning         → 93
     *   2 warnings        → 86 → floored at 85
     *   1 error           → 65
     *   2 errors          → 30
     */
    let raw = 100;
    raw -= errors.length   * 35;
    raw -= warnings.length * 7;

    let score: number;
    if (!hasError) {
      score = Math.max(warnings.length > 0 ? 85 : 100, raw);
    } else {
      score = Math.max(0, raw);
    }

    return {
      isCompatible: !hasError,
      score,
      issues: allIssues,
    };
  }
}
