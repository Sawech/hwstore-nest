/**
 * HWstore — Hardware Specs Interfaces
 * Typed representations of the JSONB `specs` field per Composant type.
 */

export interface MotherboardSpecs {
  socket: string; // cpu
  chipset: string; // motherboard type x/b/z...
  ramType: string; // DDR4/DDR5
  maxRam: number;
  pcieVersion: number; // motherboard speed reach
  formFactor: string; // ATX/Micro-ATX/Mini-ITX
  ramSlots?: number;
}

export interface CpuSpecs {
  socket: string;
  cores: number;
  threads: number;
  tdp: number; // heat produced (should be equal or lower than psu)
  memorySupport: string; // DDR4/DDR5
}

export interface GpuSpecs {
  vram: number;
  recommendedPsu: number; // Watts
  lengthMm: number;
  pcieVersion: number;
  tdp?: number;
}

export interface RamSpecs {
  type: string; // DDR4/DDR5
  speed: number; // MHz
  capacity: number;
  sticks?: number; // 1/2/4 barrets
}

export interface PsuSpecs {
  wattage: number;
  efficiency: string;  // 80+ tier: Titanium / Platinum / Gold / Silver / Bronze / White
  formFactor?: string; // ATX (default) | SFX | SFX-L | TFX | FlexATX
}

export interface CaseSpecs {
  maxGpuLength: number;            // mm
  supportedFormFactors: string[];  // MB form factors: ATX / Micro-ATX / Mini-ITX
  maxCpuCoolerHeight?: number;     // mm
  supportedPsuTypes?: string[];    // PSU form factors: ATX / SFX / SFX-L / TFX / FlexATX
}

export interface CoolerSpecs {
  supportedSockets: string[];
  tdpRating: number; // max heat cooler can handle (should be equal or more than cpu)
  heightMm?: number;
}

export type ComposantSpecs =
  | MotherboardSpecs
  | CpuSpecs
  | GpuSpecs
  | RamSpecs
  | PsuSpecs
  | CaseSpecs
  | CoolerSpecs;
