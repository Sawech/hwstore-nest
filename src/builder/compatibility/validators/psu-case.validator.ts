/**
 * HWstore — PSU ↔ Case Form Factor Validator
 *
 * Validates that the PSU's physical form factor (ATX / SFX / SFX-L / TFX / FlexATX)
 * is among the types supported by the selected case.
 *
 * Case spec example:
 *   { "supportedPsuTypes": ["ATX", "SFX"] }
 *
 * PSU spec example:
 *   { "wattage": 850, "efficiency": "Gold", "formFactor": "ATX" }
 *
 * Rules:
 *   ERROR   — PSU form factor is NOT in case's supportedPsuTypes
 *   WARNING — Case only supports SFX/SFX-L/TFX but PSU form factor is missing from specs
 *             (we cannot confirm compatibility)
 *
 * No-op when:
 *   - Neither PSU nor Case is selected
 *   - Case has no supportedPsuTypes defined (treat as "ATX only" standard tower)
 *   - PSU has no formFactor defined (treat as "ATX" default)
 */
import { Injectable } from '@nestjs/common';
import { BaseValidator } from './base.validator';
import { BuildState } from '../../interfaces/build-state.interface';
import { CompatibilityIssue } from '../compatibility.types';
import { PsuSpecs, CaseSpecs } from '../../interfaces/specs.interfaces';

/** Standard full-tower / mid-tower cases accept ATX by default */
const ATX_DEFAULT = 'ATX';

@Injectable()
export class PsuCaseValidator extends BaseValidator {
  validate(build: BuildState): CompatibilityIssue[] {
    const { psu, case: pcCase } = build;

    // Need both components to validate
    if (!psu || !pcCase) return this.ok();

    const psuSpecs  = psu.specs   as unknown as PsuSpecs;
    const caseSpecs = pcCase.specs as unknown as CaseSpecs;

    // If case has no PSU type list → assume standard ATX-only tower
    const supportedTypes: string[] =
      (caseSpecs.supportedPsuTypes as string[] | undefined) ?? [ATX_DEFAULT];

    // If PSU has no formFactor → assume ATX (market standard)
    const psuFormFactor: string = (psuSpecs.formFactor as string | undefined) ?? ATX_DEFAULT;

    // Normalise to uppercase for comparison
    const supported    = supportedTypes.map((t) => t.toUpperCase());
    const psuType      = psuFormFactor.toUpperCase();

    if (!supported.includes(psuType)) {
      return this.error(
        'PSU_FORM_FACTOR_INCOMPATIBLE',
        `PSU form factor "${psuFormFactor}" is not supported by this case — accepted types: ${supportedTypes.join(', ')}`,
        ['alimentation', 'boitier'],
      );
    }

    // Compatible — emit no issues
    return this.ok();
  }
}
