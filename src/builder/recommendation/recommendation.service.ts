/**
 * HWstore — Recommendation Service
 * Fetches candidates from DB, scores them, sorts compatible-first.
 */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Composant, ComposantType } from 'src/composants/composants.entity';
import { BuildState, TYPE_TO_SLOT } from '../interfaces/build-state.interface';
import { CompatibilityService } from '../compatibility/compatibility.service';
import {
  ScoredComposant,
  RecommendationResponse,
} from './recommendation.types';
import { CpuScorer } from './scorers/cpu.scorer';
import { GpuScorer } from './scorers/gpu.scorer';
import { PsuScorer } from './scorers/psu.scorer';
import { RamScorer } from './scorers/ram.scorer';
import { BaseScorer } from './scorers/base.scorer';

@Injectable()
export class RecommendationService {
  private readonly scorerMap: Partial<Record<ComposantType, BaseScorer>>;

  constructor(
    @InjectRepository(Composant)
    private readonly repo: Repository<Composant>,
    private readonly compatibility: CompatibilityService,
    private readonly cpuScorer: CpuScorer,
    private readonly gpuScorer: GpuScorer,
    private readonly psuScorer: PsuScorer,
    private readonly ramScorer: RamScorer,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {
    this.scorerMap = {
      processeur: this.cpuScorer,
      gpu: this.gpuScorer,
      alimentation: this.psuScorer,
      ram: this.ramScorer,
    };
  }

  async getRecommendations(
    targetType: ComposantType,
    build: BuildState,
    limit = 20,
    offset = 0,
  ): Promise<RecommendationResponse> {
    const cacheKey = this.cacheKey(targetType, build, limit, offset);
    const cached = await this.cache.get<RecommendationResponse>(cacheKey);
    if (cached) return cached;

    const candidates = await this.fetchCandidates(targetType, build);
    const scored: ScoredComposant[] = [];

    for (const candidate of candidates) {
      // Inject the candidate into the build for testing
      const slot = TYPE_TO_SLOT[targetType];
      const testBuild: BuildState = slot
        ? { ...build, [slot]: candidate }
        : { ...build };

      const compatResult = this.compatibility.validate(testBuild);
      const scorer = this.scorerMap[targetType];
      const breakdown = scorer ? scorer.score(candidate, build) : {};
      const recScore = Math.min(
        100,
        Math.round(Object.values(breakdown).reduce((a, b) => a + (b ?? 0), 0)),
      );

      // Blend: 60% compatibility, 40% recommendation quality
      const overall = Math.round(compatResult.score * 0.6 + recScore * 0.4);

      scored.push({
        composant: candidate,
        compatibilityScore: compatResult.score,
        recommendationScore: recScore,
        overallScore: overall,
        scoreBreakdown: breakdown,
        isCompatible: compatResult.isCompatible,
        incompatibilityReasons: compatResult.issues
          .filter((i) => i.severity === 'error')
          .map((i) => i.message),
      });
    }

    // Compatible first, then sort by overall score descending
    scored.sort((a, b) => {
      if (a.isCompatible !== b.isCompatible) return a.isCompatible ? -1 : 1;
      return b.overallScore - a.overallScore;
    });

    const result: RecommendationResponse = {
      targetType,
      buildContext: Object.keys(build).filter(
        (k) => !!build[k as keyof BuildState],
      ),
      results: scored.slice(offset, offset + limit),
      totalCandidates: candidates.length,
      compatibleCount: scored.filter((s) => s.isCompatible).length,
    };

    await this.cache.set(cacheKey, result, 60_000); // 60s TTL
    return result;
  }

  // ── DB Pre-filtering ────────────────────────────────────────────────────────

  private async fetchCandidates(
    type: ComposantType,
    build: BuildState,
  ): Promise<Composant[]> {
    const qb = this.repo
      .createQueryBuilder('c')
      .where('c.type = :type', { type })
      .andWhere('c.stock > 0');

    // Push compatible filters to DB layer (index-backed)
    if (type === 'processeur' && build.motherboard) {
      const socket = (build.motherboard.specs as any).socket;
      if (socket) qb.andWhere(`c.specs->>'socket' = :socket`, { socket });
    }

    if (type === 'ram' && build.motherboard) {
      const ramType = (build.motherboard.specs as any).ramType;
      if (ramType) qb.andWhere(`c.specs->>'type' = :ramType`, { ramType });
    }

    if (type === 'gpu' && build.case) {
      const maxLen = (build.case.specs as any).maxGpuLength;
      if (maxLen)
        qb.andWhere(`(c.specs->>'lengthMm')::int <= :maxLen`, { maxLen });
    }

    if (type === 'alimentation' && (build.cpu || build.gpu)) {
      // Minimal wattage pre-filter at DB (exact check in validator)
      const minWatts = 300;
      qb.andWhere(`(c.specs->>'wattage')::int >= :minWatts`, { minWatts });
    }

    return qb.orderBy('c.rating', 'DESC').getMany();
  }

  // ── Cache key ───────────────────────────────────────────────────────────────

  private cacheKey(
    type: string,
    build: BuildState,
    limit: number,
    offset: number,
  ): string {
    const context = Object.entries(build)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${(v as Composant).id}`)
      .sort()
      .join('|');
    return `hwstore:rec:${type}:${context}:${limit}:${offset}`;
  }
}
