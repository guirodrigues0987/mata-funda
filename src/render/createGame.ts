import Phaser from "phaser";
import { PALETTE } from "../data/palette";
import { RENDER } from "../data/render";
import { GameScene } from "./GameScene";

export function createGame(): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: RENDER.baseWidth,
    height: RENDER.baseHeight,
    backgroundColor: PALETTE.noite,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [GameScene],
  });
}
