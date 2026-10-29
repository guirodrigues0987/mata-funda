import Phaser from "phaser";
import { PALETTE } from "../data/palette";
import { advanceClock, createClock, createInitialState, step } from "../sim";
import type { Clock, GameState } from "../sim";
import { createLightRig, updateLight } from "./lightView";
import { createEnzoView } from "./playerView";
import { createMapView } from "./mapView";
import { createBatteryHud, updateBatteryHud } from "./hudView";
import type { BatteryHud } from "./hudView";
import { readCommand } from "./readCommand";

export class GameScene extends Phaser.Scene {
  private state: GameState = createInitialState();
  private clock: Clock = createClock();
  private wasd!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private light!: Phaser.GameObjects.Light;
  private marker!: Phaser.GameObjects.Graphics;
  private lKey!: Phaser.Input.Keyboard.Key;
  private hud!: BatteryHud;

  constructor() {
    super("game");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.noite);
    const kb = this.input.keyboard!;
    this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
    this.lKey = kb.addKey("L");
    this.light = createLightRig(this);
    createMapView(this);
    this.marker = createEnzoView(this);
    this.hud = createBatteryHud(this);
    this.draw();
  }

  update(_time: number, delta: number): void {
    const advanced = advanceClock(this.clock, delta);
    this.clock = advanced.clock;
    // JustDown le uma vez por quadro; o pulso vai so ao primeiro tick do quadro.
    let pulse = Phaser.Input.Keyboard.JustDown(this.lKey);
    for (let i = 0; i < advanced.ticks; i++) {
      this.state = step(this.state, this.command(pulse));
      pulse = false;
    }
    this.draw();
  }

  private command(toggleLight: boolean) {
    return readCommand({
      left: this.wasd.A.isDown,
      right: this.wasd.D.isDown,
      up: this.wasd.W.isDown,
      down: this.wasd.S.isDown,
      toggleLight,
    });
  }

  private draw(): void {
    updateLight(this.light, this.state.player, this.state.light);
    updateBatteryHud(this.hud, this.state.light);
    this.marker.setPosition(this.state.player.x, this.state.player.y);
    this.cameras.main.centerOn(this.state.player.x, this.state.player.y);
  }
}
