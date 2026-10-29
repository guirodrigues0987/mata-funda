import { ENZO_COMBAT } from "./combat";

export const PLAYER = {
  speedTilesPerSecond: 5,
  // Meia-caixa de colisao (pe do Enzo), em tiles.
  halfWidthTiles: 0.25,
  halfHeightTiles: 0.25,
  maxHp: ENZO_COMBAT.maxHp,
} as const;
