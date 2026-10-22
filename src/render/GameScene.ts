import Phaser from "phaser";
import { PALETTE } from "../data/palette";
import { RENDER } from "../data/render";
import { advanceClock, createClock, createInitialState, step } from "../sim";
import type { Clock, GameState } from "../sim";
import { hexToNumber } from "../sim";
import { readCommand } from "./readCommand";

export class GameScene extends Phaser.Scene {
  private state: GameState = createInitialState();
  private clock: Clock = createClock();
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private marker!: Phaser.GameObjects.Rectangle;

  constructor() {
    super("game");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.noite);
    const kb = this.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
    this.marker = this.add.rectangle(0, 0, 32, 32, hexToNumber(PALETTE.broto));
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
      left: this.cursors.left.isDown || this.wasd.A.isDown,
      right: this.cursors.right.isDown || this.wasd.D.isDown,
      up: this.cursors.up.isDown || this.wasd.W.isDown,
      down: this.cursors.down.isDown || this.wasd.S.isDown,
    });
  }

  private draw(): void {
    this.marker.setPosition(
      RENDER.baseWidth / 2 + this.state.player.x,
      RENDER.baseHeight / 2 + this.state.player.y,
    );
  }
}
