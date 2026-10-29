import type Phaser from "phaser";
import { RENDER } from "../data/render";
import { TEXTS } from "../data/texts";
import { batteryPercent, hexToNumber } from "../sim";
import type { LightState } from "../sim";

export type BatteryHud = {
  readonly text: Phaser.GameObjects.Text;
  readonly fill: Phaser.GameObjects.Graphics;
};

// Sem pipeline de luz: objetos criados sem setPipeline("Light2D") nao escurecem.
export function createBatteryHud(scene: Phaser.Scene): BatteryHud {
  const h = RENDER.hud;
  const g = scene.add.graphics().setScrollFactor(0).setDepth(h.depth);
  g.lineStyle(h.iconBorderPx, hexToNumber(h.color), 1);
  g.strokeRect(h.marginPx, h.marginPx, h.iconWidthPx, h.iconHeightPx);
  g.fillStyle(hexToNumber(h.color), 1);
  g.fillRect(
    h.marginPx + h.iconWidthPx,
    h.marginPx + (h.iconHeightPx - h.iconTipHeightPx) / 2,
    h.iconTipWidthPx,
    h.iconTipHeightPx,
  );
  const fill = scene.add.graphics().setScrollFactor(0).setDepth(h.depth);
  const text = scene.add
    .text(h.marginPx + h.iconWidthPx + h.iconTipWidthPx + h.textGapPx, h.marginPx + h.iconHeightPx / 2, "", {
      fontFamily: h.fontFamily,
      fontSize: `${h.fontSizePx}px`,
      color: h.color,
      stroke: h.outlineColor,
      strokeThickness: 4,
    })
    .setOrigin(0, 0.5)
    .setScrollFactor(0)
    .setDepth(h.depth);
  return { text, fill };
}

export function updateBatteryHud(hud: BatteryHud, light: LightState): void {
  const h = RENDER.hud;
  const pct = batteryPercent(light);
  hud.text.setText(TEXTS.batteryLabel(pct));
  const innerW = h.iconWidthPx - 2 * h.iconBorderPx - 2 * h.iconPaddingPx;
  const innerH = h.iconHeightPx - 2 * h.iconBorderPx - 2 * h.iconPaddingPx;
  hud.fill.clear();
  hud.fill.fillStyle(hexToNumber(h.fillColor), 1);
  hud.fill.fillRect(
    h.marginPx + h.iconBorderPx + h.iconPaddingPx,
    h.marginPx + h.iconBorderPx + h.iconPaddingPx,
    (innerW * pct) / 100,
    innerH,
  );
}
