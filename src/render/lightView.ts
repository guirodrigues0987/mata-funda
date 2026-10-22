import type Phaser from "phaser";
import { LIGHT } from "../data/light";
import { RENDER } from "../data/render";
import { hexToNumber, lightRadiusPx } from "../sim";

export function createLightRig(scene: Phaser.Scene): Phaser.GameObjects.Light {
  scene.lights.enable();
  scene.lights.setAmbientColor(hexToNumber(LIGHT.ambientColor));
  return scene.lights.addLight(
    RENDER.baseWidth / 2,
    RENDER.baseHeight / 2,
    lightRadiusPx(),
    hexToNumber(LIGHT.color),
    LIGHT.intensity,
  );
}

export function updateLight(light: Phaser.GameObjects.Light, player: { x: number; y: number }): void {
  light.setPosition(RENDER.baseWidth / 2 + player.x, RENDER.baseHeight / 2 + player.y);
}
