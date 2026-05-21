/**
 * HWstore — Abstract Base Scorer
 */
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from '../../interfaces/build-state.interface';
import { ScoreBreakdown } from '../recommendation.types';

export abstract class BaseScorer {
  /** Score a candidate against the current build. Values in breakdown should sum ≤ 100. */
  abstract score(candidate: Composant, build: BuildState): ScoreBreakdown;

  /** Sum a breakdown object into a single 0–100 value. */
  protected total(breakdown: ScoreBreakdown): number {
    return Math.min(
      100,
      Math.round(
        Object.values(breakdown).reduce((a, b) => a + (b ?? 0), 0),
      ),
    );
  }
}
