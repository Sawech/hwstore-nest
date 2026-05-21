/**
 * HWstore — CPU ↔ Motherboard Validator
 * Rules: socket match (hard), memory type match (soft)
 */
import { Injectable } from '@nestjs/common';
import { BaseValidator } from './base.validator';
import { BuildState } from '../../interfaces/build-state.interface';
import { CompatibilityIssue } from '../compatibility.types';
import { CpuSpecs, MotherboardSpecs } from '../../interfaces/specs.interfaces';

@Injectable()
export class CpuMotherboardValidator extends BaseValidator {
  validate(build: BuildState): CompatibilityIssue[] {
    const { cpu, motherboard } = build;
    if (!cpu || !motherboard) return this.ok();

    const cpuSpecs = cpu.specs as unknown as CpuSpecs;
    const mbSpecs  = motherboard.specs as unknown as MotherboardSpecs;
    const issues: CompatibilityIssue[] = [];

    if (cpuSpecs.socket !== mbSpecs.socket) {
      issues.push(...this.error(
        'CPU_SOCKET_MISMATCH',
        `CPU socket ${cpuSpecs.socket} is incompatible with motherboard socket ${mbSpecs.socket}`,
        ['cpu', 'motherboard'],
      ));
    }

    if (cpuSpecs.memorySupport && mbSpecs.ramType &&
        cpuSpecs.memorySupport !== mbSpecs.ramType) {
      issues.push(...this.warning(
        'CPU_MEMORY_TYPE_MISMATCH',
        `CPU supports ${cpuSpecs.memorySupport} but motherboard uses ${mbSpecs.ramType}`,
        ['cpu', 'motherboard'],
      ));
    }

    return issues;
  }
}
