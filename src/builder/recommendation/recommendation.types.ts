/**
 * HWstore — Recommendation Types
 */
import { Composant } from 'src/composants/composants.entity';

export interface ScoreBreakdown {
  socketMatch?: number;
  ramTypeMatch?: number;
  powerFit?: number;
  physicalFit?: number;
  futureProofing?: number;
  // pricePerformance?: number;
  efficiency?: number;
  // vramValue?: number;
  pcieVersion?: number;
  thermalHeadroom?: number;
}

export interface ScoredComposant {
  composant: Composant;
  compatibilityScore: number; // 0–100: derived from CompatibilityService
  recommendationScore: number; // 0–100: derived from scorer
  overallScore: number; // weighted blend (60/40)
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
