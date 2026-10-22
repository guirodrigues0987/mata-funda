import type Phaser from "phaser";
import { PALETTE } from "../data/palette";
import { WORLD } from "../data/world";
import { TEST_MAP } from "../data/testMap";
import { hexToNumber, isTileBlocked } from "../sim";

function makeTile(scene: Phaser.Scene, key: string, fill: string, line?: string): void {
  if (scene.textures.exists(key)) return;
  const t = WORLD.tilePx;
  const g = scene.make.graphics({}, false);
  g.fillStyle(hexToNumber(fill), 1);
  g.fillRect(0, 0, t, t);
  if (line) {
    g.lineStyle(4, hexToNumber(line), 1);
    g.strokeRect(2, 2, t - 4, t - 4);
  }
  g.generateTexture(key, t, t);
  g.destroy();
}

// Graphics nao recebe Light2D: gera texturas e usa uma Image por tile.
export function createMapView(scene: Phaser.Scene): Phaser.GameObjects.Image[] {
  makeTile(scene, "tile-chao", PALETTE.mataEscura);
  makeTile(scene, "tile-parede", PALETTE.noite, PALETTE.folhagem);
  const t = WORLD.tilePx;
  const out: Phaser.GameObjects.Image[] = [];
  TEST_MAP.rows.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      const key = isTileBlocked(TEST_MAP, col, row) ? "tile-parede" : "tile-chao";
      out.push(scene.add.image(col * t, row * t, key).setOrigin(0, 0).setPipeline("Light2D"));
    }
  });
  return out;
}
