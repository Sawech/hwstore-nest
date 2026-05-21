/**
 * HWstore — Build State Interface
 */
import { Composant } from 'src/composants/composants.entity';

export interface BuildState {
  motherboard?: Composant;
  cpu?: Composant;
  gpu?: Composant;
  ram?: Composant;
  psu?: Composant;
  case?: Composant;
  cooler?: Composant;
  storage?: Composant;
}

export type BuildSlot = keyof BuildState;

export const SLOT_TO_TYPE: Record<BuildSlot, string> = {
  motherboard: 'carte-mere',
  cpu: 'processeur',
  gpu: 'gpu',
  ram: 'ram',
  psu: 'alimentation',
  case: 'boitier',
  cooler: 'refroidissement',
  storage: 'stockage',
};

export const TYPE_TO_SLOT: Record<string, BuildSlot> = {
  'carte-mere': 'motherboard',
  processeur: 'cpu',
  gpu: 'gpu',
  ram: 'ram',
  alimentation: 'psu',
  boitier: 'case',
  refroidissement: 'cooler',
  stockage: 'storage',
};
