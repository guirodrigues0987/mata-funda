import { WORLD } from "./world";

export const RENDER = {
  baseWidth: 1920,
  baseHeight: 1080,
  tilePx: WORLD.tilePx,
  // Placeholder do Enzo (proporcoes em tiles)
  enzoWidthTiles: 0.5,
  enzoHeightTiles: 1,
  enzoCapHeightTiles: 0.2,
  enzoOutlinePx: 3,
} as const;
