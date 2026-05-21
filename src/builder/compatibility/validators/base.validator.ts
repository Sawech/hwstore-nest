/**
 * HWstore — Abstract Base Validator
 */
import { BuildState } from '../../interfaces/build-state.interface';
import { CompatibilityIssue } from '../compatibility.types';

export abstract class BaseValidator {
  abstract validate(build: BuildState): CompatibilityIssue[];

  protected ok(): CompatibilityIssue[] {
    return [];
  }

  protected error(
    rule: string,
    message: string,
    affectedSlots: string[],
  ): CompatibilityIssue[] {
    return [{ severity: 'error', rule, message, affectedSlots }];
  }

  protected warning(
    rule: string,
    message: string,
    affectedSlots: string[],
  ): CompatibilityIssue[] {
    return [{ severity: 'warning', rule, message, affectedSlots }];
  }
}
