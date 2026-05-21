/**
 * HWstore — Builder Controller
 *
 * POST /builder/recommendations   → scored + ranked composant list
 * POST /builder/validate          → full compatibility report
 * GET  /builder/compatible-composants → compatible-only shortcut
 */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation/recommendation.service';
import { CompatibilityService } from './compatibility/compatibility.service';
import { BuildStateResolverService } from './build-state-resolver.service';
import { RecommendationsQueryDto } from './dto/recommendations-query.dto';
import { ValidateBuildDto } from './dto/validate-build.dto';
import { ComposantType } from 'src/composants/composants.entity';

@Controller('builder')
export class BuilderController {
  constructor(
    private readonly recommendations: RecommendationService,
    private readonly compatibility: CompatibilityService,
    private readonly resolver: BuildStateResolverService,
  ) {}

  /**
   * POST /builder/recommendations
   * Returns: ranked, scored list of composants for targetType
   */
  @Post('recommendations')
  async getRecommendations(@Body() dto: RecommendationsQueryDto) {
    const build = await this.resolver.resolve(dto);
    return this.recommendations.getRecommendations(
      dto.targetType as ComposantType,
      build,
      dto.limit,
      dto.offset,
    );
  }

  /**
   * POST /builder/validate
   * Returns: full CompatibilityResult for the current build state
   */
  @Post('validate')
  async validateBuild(@Body() dto: ValidateBuildDto) {
    const build = await this.resolver.resolve(dto);
    return this.compatibility.validate(build);
  }

  /**
   * GET /builder/compatible-composants?targetType=gpu&motherboardId=5
   * Returns: only isCompatible=true items (no incompatible suggestions)
   */
  @Get('compatible-composants')
  async getCompatible(@Query() dto: RecommendationsQueryDto) {
    const build = await this.resolver.resolve(dto);
    const result = await this.recommendations.getRecommendations(
      dto.targetType as ComposantType,
      build,
      dto.limit,
      dto.offset,
    );
    return {
      ...result,
      results: result.results.filter((r) => r.isCompatible),
      compatibleCount: result.compatibleCount,
    };
  }
}
