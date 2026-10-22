import type Phaser from "phaser";
import { PALETTE } from "../data/palette";
import { RENDER } from "../data/render";
import { hexToNumber } from "../sim";

// Placeholder do Enzo: capsula escura com bone colorido (unico detalhe de cor). Origem no centro.
export function createEnzoView(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const w = RENDER.enzoWidthTiles * RENDER.tilePx;
  const h = RENDER.enzoHeightTiles * RENDER.tilePx;
  const capH = RENDER.enzoCapHeightTiles * RENDER.tilePx;
  const g = scene.add.graphics();
  g.fillStyle(hexToNumber(PALETTE.mataEscura), 1);
  g.lineStyle(RENDER.enzoOutlinePx, hexToNumber(PALETTE.folhagem), 1);
  g.fillRoundedRect(-w / 2, -h / 2, w, h, w / 2);
  g.strokeRoundedRect(-w / 2, -h / 2, w, h, w / 2);
  g.fillStyle(hexToNumber(PALETTE.fogo), 1);
  g.fillRoundedRect(-w / 2, -h / 2 + h * 0.08, w, capH, { tl: capH / 2, tr: capH / 2, bl: 0, br: 0 });
  return g;
}
