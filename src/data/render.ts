import { PALETTE } from "./palette";
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
  hud: {
    marginPx: 24,
    iconWidthPx: 56,
    iconHeightPx: 28,
    iconBorderPx: 3,
    iconTipWidthPx: 6,
    iconTipHeightPx: 12,
    iconPaddingPx: 4,
    textGapPx: 14,
    fontSizePx: 32,
    fontFamily: "monospace",
    depth: 1000,
    color: PALETTE.osso,
    fillColor: PALETTE.luz,
    outlineColor: PALETTE.noite,
  },
} as const;
