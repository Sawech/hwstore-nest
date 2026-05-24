/**
 * HWstore — Recommendation Types
 */
import { Composant } from 'src/composants/composants.entity';

export interface ScoreBreakdown {
  socketMatch?:    number;  // CPU: socket match vs motherboard
  ramTypeMatch?:   number;  // CPU/RAM: DDR type match vs motherboard
  powerFit?:       number;  // GPU/PSU: PSU headroom
  physicalFit?:    number;  // GPU: case clearance
  futureProofing?: number;  // CPU: core count | RAM: speed rating
  efficiency?:     number;  // PSU: 80+ efficiency tier
  vramValue?:      number;  // GPU: VRAM capacity hardware tier
  pcieVersion?:    number;  // GPU: PCIe generation
  thermalHeadroom?: number; // Cooler: TDP headroom above CPU
}

export interface ScoredComposant {
  composant: Composant;
  compatibilityScore: number;  // 0–100: from CompatibilityService
  recommendationScore: number; // 0–100: from scorer
  overallScore: number;        // 50/50 blend
  scoreBreakdown: ScoreBreakdown;
  isCompatible: boolean;
  incompatibilityReasons: string[];
}

export interface RecommendationResponse {
  targetType: string;
  buildContext: string[]; // which slots are currently filled
  results: ScoredComposant[];
  totalCandidates: number;
  compatibleCount: number;
}
