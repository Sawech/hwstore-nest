/**
 * HWstore — Cooler ↔ CPU Validator
 * Rules: socket support (hard), TDP rating vs CPU TDP (soft)
 */
import { Injectable } from '@nestjs/common';
import { BaseValidator } from './base.validator';
import { BuildState } from '../../interfaces/build-state.interface';
import { CompatibilityIssue } from '../compatibility.types';
import { CoolerSpecs, CpuSpecs } from '../../interfaces/specs.interfaces';

@Injectable()
export class CoolerCpuValidator extends BaseValidator {
  validate(build: BuildState): CompatibilityIssue[] {
    const { cooler, cpu } = build;
    if (!cooler || !cpu) return this.ok();

    const coolerSpecs = cooler.specs as unknown as CoolerSpecs;
    const cpuSpecs    = cpu.specs    as unknown as CpuSpecs;
    const issues: CompatibilityIssue[] = [];

    if (
      Array.isArray(coolerSpecs.supportedSockets) &&
      !coolerSpecs.supportedSockets.includes(cpuSpecs.socket)
    ) {
      issues.push(...this.error(
        'COOLER_SOCKET_INCOMPATIBLE',
        `Cooler does not support socket ${cpuSpecs.socket} (supports: ${coolerSpecs.supportedSockets.join(', ')})`,
        ['refroidissement', 'processeur'],
      ));
    }

    if (coolerSpecs.tdpRating && cpuSpecs.tdp && coolerSpecs.tdpRating < cpuSpecs.tdp) {
      issues.push(...this.warning(
        'COOLER_TDP_MARGINAL',
        `Cooler rated for ${coolerSpecs.tdpRating}W but CPU TDP is ${cpuSpecs.tdp}W — may throttle under sustained load`,
        ['refroidissement', 'processeur'],
      ));
    }

    return issues;
  }
}
