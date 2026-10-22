import Phaser from "phaser";
import { PALETTE } from "../data/palette";
import { RENDER } from "../data/render";
import { advanceClock, createClock, createInitialState, step } from "../sim";
import type { Clock, GameState } from "../sim";
import { createEnzoView } from "./playerView";
import { readCommand } from "./readCommand";

export class GameScene extends Phaser.Scene {
  private state: GameState = createInitialState();
  private clock: Clock = createClock();
  private wasd!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private marker!: Phaser.GameObjects.Graphics;

  constructor() {
    super("game");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.noite);
    const kb = this.input.keyboard!;
    this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
    this.marker = createEnzoView(this);
    this.draw();
  }

  update(_time: number, delta: number): void {
    const advanced = advanceClock(this.clock, delta);
    this.clock = advanced.clock;
    for (let i = 0; i < advanced.ticks; i++) {
      this.state = step(this.state, this.command());
    }
    this.draw();
  }

  private command() {
    return readCommand({
      left: this.wasd.A.isDown,
      right: this.wasd.D.isDown,
      up: this.wasd.W.isDown,
      down: this.wasd.S.isDown,
    });
  }

  private draw(): void {
    this.marker.setPosition(
      RENDER.baseWidth / 2 + this.state.player.x,
      RENDER.baseHeight / 2 + this.state.player.y,
    );
  }
}
