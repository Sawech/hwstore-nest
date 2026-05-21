/**
 * HWstore — Motherboard ↔ Case Form Factor Validator
 */
import { Injectable } from '@nestjs/common';
import { BaseValidator } from './base.validator';
import { BuildState } from '../../interfaces/build-state.interface';
import { CompatibilityIssue } from '../compatibility.types';
import { MotherboardSpecs, CaseSpecs } from '../../interfaces/specs.interfaces';

@Injectable()
export class MotherboardCaseValidator extends BaseValidator {
  validate(build: BuildState): CompatibilityIssue[] {
    const { motherboard, case: pcCase } = build;
    if (!motherboard || !pcCase) return this.ok();

    const mbSpecs   = motherboard.specs as unknown as MotherboardSpecs;
    const caseSpecs = pcCase.specs      as unknown as CaseSpecs;

    if (
      Array.isArray(caseSpecs.supportedFormFactors) &&
      !caseSpecs.supportedFormFactors.includes(mbSpecs.formFactor)
    ) {
      return this.error(
        'FORMFACTOR_MISMATCH',
        `Motherboard form factor ${mbSpecs.formFactor} is not supported by this case (supports: ${caseSpecs.supportedFormFactors.join(', ')})`,
        ['carte-mere', 'boitier'],
      );
    }

    return this.ok();
  }
}
