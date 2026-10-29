import Phaser from "phaser";
import { PALETTE } from "../data/palette";
import { ENZO_COMBAT, WEAPONS } from "../data/combat";
import { RENDER } from "../data/render";
import { SIM } from "../data/sim";
import { WORLD } from "../data/world";
import { advanceClock, damagePlayer, createClock, createInitialState, isDodging, step } from "../sim";
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
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private hud!: BatteryHud;
  private kKey!: Phaser.Input.Keyboard.Key;
  private clicked = false;
  private combatGfx!: Phaser.GameObjects.Graphics;
  private hpText!: Phaser.GameObjects.Text;

  constructor() {
    super("game");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.noite);
    const kb = this.input.keyboard!;
    this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
    this.lKey = kb.addKey("L");
    this.spaceKey = kb.addKey("SPACE");
    this.kKey = kb.addKey("K");
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (p.leftButtonDown()) this.clicked = true;
    });
    this.combatGfx = this.add.graphics().setDepth(RENDER.depth.combat);
    this.hpText = this.add.text(24, 64, "", { fontFamily: "monospace", fontSize: "28px", color: "#ffffff" });
    this.hpText.setScrollFactor(0).setDepth(1000);
    this.light = createLightRig(this);
    createMapView(this).forEach((t) => t.setDepth(RENDER.depth.map));
    this.marker = createEnzoView(this).setDepth(RENDER.depth.enzo);
    this.hud = createBatteryHud(this);
    this.draw();
  }

  update(_time: number, delta: number): void {
    const advanced = advanceClock(this.clock, delta);
    this.clock = advanced.clock;
    // JustDown le uma vez por quadro; o pulso vai so ao primeiro tick do quadro.
    let pulse = Phaser.Input.Keyboard.JustDown(this.lKey);
    let dodgePulse = Phaser.Input.Keyboard.JustDown(this.spaceKey);
    // TEMPORARIO (playtest): K causa 3 de dano ao Enzo.
    if (Phaser.Input.Keyboard.JustDown(this.kKey)) this.state = damagePlayer(this.state, 3);
    let attackPulse = this.clicked;
    this.clicked = false;
    for (let i = 0; i < advanced.ticks; i++) {
      this.state = step(this.state, this.command(pulse, dodgePulse, attackPulse));
      pulse = false;
      dodgePulse = false;
      attackPulse = false;
    }
    this.draw();
  }

  private command(toggleLight: boolean, dodge: boolean, attack: boolean) {
    const ptr = this.input.activePointer;
    return readCommand({
      left: this.wasd.A.isDown,
      right: this.wasd.D.isDown,
      up: this.wasd.W.isDown,
      down: this.wasd.S.isDown,
      toggleLight,
      dodge,
      attack,
      aimX: ptr.worldX - this.state.player.x,
      aimY: ptr.worldY - this.state.player.y,
    });
  }

  private draw(): void {
    updateLight(this.light, this.state.player, this.state.light);
    updateBatteryHud(this.hud, this.state.light);
    this.marker.setPosition(this.state.player.x, this.state.player.y);
    const blink = this.state.player.invulnerableTicks > 0 && Math.floor(this.state.tick / 5) % 2 === 0;
    this.marker.setAlpha(isDodging(this.state) ? 0.4 : blink ? 0.3 : 1);
    this.drawCombat();
    this.cameras.main.centerOn(this.state.player.x, this.state.player.y);
  }

  private drawCombat(): void {
    const g = this.combatGfx;
    const st = this.state;
    g.clear();
    g.fillStyle(0xaa4444, 1);
    for (const d of st.dummies) g.fillRect(d.x - 16, d.y - 24, 32, 48);
    const sw = st.lastSwing;
    if (sw !== null && st.tick - sw.tick <= Math.round(0.1 * SIM.ticksPerSecond)) {
      const w = WEAPONS.galho;
      const a = Math.atan2(sw.dirY, sw.dirX);
      const half = (w.arcDegrees / 2) * (Math.PI / 180);
      g.lineStyle(6, 0xffffff, 1);
      g.beginPath();
      g.arc(st.player.x, st.player.y, w.reachTiles * WORLD.tilePx, a - half, a + half);
      g.strokePath();
    }
    const p = st.player;
    this.hpText.setText(`Vida ${p.hp}/${ENZO_COMBAT.maxHp}${p.fainted ? " - DESMAIOU" : ""}`);
  }
}
