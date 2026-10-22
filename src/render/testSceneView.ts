import type Phaser from "phaser";
import { TEST_SCENE } from "../data/testScene";
import { RENDER } from "../data/render";
import { hexToNumber } from "../sim";

// Graphics nao recebe Light2D: gera textura e usa Image.
export function createTestScene(scene: Phaser.Scene): Phaser.GameObjects.Image[] {
  return TEST_SCENE.shapes.map((s, i) => {
    const key = `forma-${s.id}`;
    if (!scene.textures.exists(key)) {
      const g = scene.make.graphics({}, false);
      g.fillStyle(hexToNumber(TEST_SCENE.colors[i % TEST_SCENE.colors.length]), 1);
      g.fillRect(0, 0, s.width, s.height);
      g.generateTexture(key, s.width, s.height);
      g.destroy();
    }
    return scene.add
      .image(RENDER.baseWidth / 2 + s.x, RENDER.baseHeight / 2 + s.y, key)
      .setPipeline("Light2D");
  });
}
