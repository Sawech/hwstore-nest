/**
 * HWstore — Compatibility Types
 */

export type CompatibilitySeverity = 'error' | 'warning' | 'ok';

export interface CompatibilityIssue {
  severity: CompatibilitySeverity;
  rule: string;          // e.g. 'CPU_SOCKET_MISMATCH'
  message: string;
  affectedSlots: string[];
}

export interface CompatibilityResult {
  isCompatible: boolean;   // false if any 'error' issue exists
  score: number;           // 0–100
  issues: CompatibilityIssue[];
}
