import type Phaser from "phaser";
import { LIGHT } from "../data/light";
import { currentLightRadiusPx, hexToNumber, lightRadiusPx } from "../sim";
import type { LightState } from "../sim";

export function createLightRig(scene: Phaser.Scene): Phaser.GameObjects.Light {
  scene.lights.enable();
  scene.lights.setAmbientColor(hexToNumber(LIGHT.ambientColor));
  return scene.lights.addLight(
    0,
    0,
    lightRadiusPx(),
    hexToNumber(LIGHT.color),
    LIGHT.intensity,
  );
}

export function updateLight(
  light: Phaser.GameObjects.Light,
  player: { x: number; y: number },
  state: LightState,
): void {
  light.setPosition(player.x, player.y);
  light.setRadius(currentLightRadiusPx(state));
}
