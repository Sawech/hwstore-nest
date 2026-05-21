/**
 * HWstore — RAM ↔ Motherboard Validator
 * Rules: DDR type match (hard), max RAM capacity (soft)
 */
import { Injectable } from '@nestjs/common';
import { BaseValidator } from './base.validator';
import { BuildState } from '../../interfaces/build-state.interface';
import { CompatibilityIssue } from '../compatibility.types';
import { RamSpecs, MotherboardSpecs } from '../../interfaces/specs.interfaces';

@Injectable()
export class RamMotherboardValidator extends BaseValidator {
  validate(build: BuildState): CompatibilityIssue[] {
    const { ram, motherboard } = build;
    if (!ram || !motherboard) return this.ok();

    const ramSpecs = ram.specs as unknown as RamSpecs;
    const mbSpecs  = motherboard.specs as unknown as MotherboardSpecs;
    const issues: CompatibilityIssue[] = [];

    if (ramSpecs.type !== mbSpecs.ramType) {
      issues.push(...this.error(
        'RAM_TYPE_MISMATCH',
        `RAM type ${ramSpecs.type} is incompatible with motherboard ${mbSpecs.ramType} slots`,
        ['ram', 'motherboard'],
      ));
    }

    const totalGb = ramSpecs.capacity * (ramSpecs.sticks ?? 1);
    if (mbSpecs.maxRam && totalGb > mbSpecs.maxRam) {
      issues.push(...this.warning(
        'RAM_EXCEEDS_MOTHERBOARD_MAX',
        `${totalGb}GB kit exceeds this motherboard's maximum of ${mbSpecs.maxRam}GB`,
        ['ram', 'motherboard'],
      ));
    }

    return issues;
  }
}
