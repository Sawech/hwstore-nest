/**
 * HWstore — Build State Resolver
 * Hydrates slot IDs from the DTO into full Composant entities via a single DB query.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Composant } from 'src/composants/composants.entity';
import { BuildState } from './interfaces/build-state.interface';
import { BuildStateDto } from './dto/build-state.dto';

@Injectable()
export class BuildStateResolverService {
  constructor(
    @InjectRepository(Composant)
    private readonly repo: Repository<Composant>,
  ) {}

  async resolve(dto: BuildStateDto): Promise<BuildState> {
    const idMap: Record<keyof BuildState, number | undefined> = {
      motherboard: dto.motherboardId,
      cpu: dto.cpuId,
      gpu: dto.gpuId,
      ram: dto.ramId,
      psu: dto.psuId,
      case: dto.caseId,
      cooler: dto.coolerId,
      storage: dto.storageId,
    };

    const ids = Object.values(idMap).filter((id): id is number => !!id);
    if (ids.length === 0) return {};

    const composants = await this.repo.find({ where: { id: In(ids) } });
    const byId = new Map(composants.map((c) => [c.id, c]));

    const build: BuildState = {};
    for (const [slot, id] of Object.entries(idMap)) {
      if (id) {
        const comp = byId.get(id);
        if (comp) build[slot as keyof BuildState] = comp;
      }
    }
    return build;
  }
}
