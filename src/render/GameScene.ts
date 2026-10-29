import Phaser from "phaser";
import { PALETTE } from "../data/palette";
import { COMBAT_VIEW, ENZO_COMBAT, WEAPONS } from "../data/combat";
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
import { consumeClick } from "./clickPulse";
import { hitFeedbackView } from "./hitFeedback";

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
  private dmgText!: Phaser.GameObjects.Text;
  private dummyHpText!: Phaser.GameObjects.Text;

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
    this.dmgText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: `${COMBAT_VIEW.damageTextFontSizePx}px`,
        fontStyle: "bold",
        color: COMBAT_VIEW.damageTextColor,
        stroke: COMBAT_VIEW.damageTextStrokeColor,
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(RENDER.depth.combat + 1)
      .setVisible(false);
    this.dummyHpText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: `${COMBAT_VIEW.hpTextFontSizePx}px`,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 1)
      .setDepth(RENDER.depth.combat + 1)
      .setVisible(false);
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
    if (Phaser.Input.Keyboard.JustDown(this.kKey)) this.state = damagePlayer(this.state, COMBAT_VIEW.debugKeyDamage);
    const click = consumeClick(this.clicked, advanced.ticks);
    let attackPulse = click.pulse;
    this.clicked = click.pending;
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
    const world = this.cameras.main.getWorldPoint(ptr.x, ptr.y);
    return readCommand({
      left: this.wasd.A.isDown,
      right: this.wasd.D.isDown,
      up: this.wasd.W.isDown,
      down: this.wasd.S.isDown,
      toggleLight,
      dodge,
      attack,
      aimX: world.x - this.state.player.x,
      aimY: world.y - this.state.player.y,
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
    const fb = hitFeedbackView(st);
    const dw = COMBAT_VIEW.dummyWidthPx;
    const dh = COMBAT_VIEW.dummyHeightPx;
    for (const d of st.dummies) {
      g.fillStyle(d.id === fb.flashTargetId ? COMBAT_VIEW.hitFlashColor : COMBAT_VIEW.dummyColor, 1);
      g.fillRect(d.x - dw / 2, d.y - dh / 2, dw, dh);
    }
    // Barra e texto de vida do alvo (sempre visiveis enquanto ele existe)
    const bw = COMBAT_VIEW.hpBarWidthPx;
    const bh = COMBAT_VIEW.hpBarHeightPx;
    const first = fb.hp[0];
    for (const h of fb.hp) {
      const by = h.y - dh / 2 - COMBAT_VIEW.hpBarOffsetYPx - bh;
      g.fillStyle(COMBAT_VIEW.hpBarBackColor, 1);
      g.fillRect(h.x - bw / 2, by, bw, bh);
      g.fillStyle(COMBAT_VIEW.hpBarFillColor, 1);
      g.fillRect(h.x - bw / 2, by, bw * Math.max(0, Math.min(1, h.cur / h.max)), bh);
    }
    if (first === undefined) this.dummyHpText.setVisible(false);
    else {
      const by = first.y - dh / 2 - COMBAT_VIEW.hpBarOffsetYPx - bh;
      this.dummyHpText.setText(`${first.cur}/${first.max}`).setPosition(first.x, by - 2).setVisible(true);
    }
    // Numero do dano: sobe enquanto some; tambem no golpe fatal
    const dt = fb.damageText;
    if (dt === null) this.dmgText.setVisible(false);
    else
      this.dmgText
        .setText(dt.text)
        .setPosition(dt.x, dt.y - dh / 2 - 36 - COMBAT_VIEW.damageTextRisePx * dt.progress)
        .setVisible(true);
    const sw = st.lastSwing;
    if (sw !== null && st.tick - sw.tick <= Math.round(COMBAT_VIEW.arcShowSeconds * SIM.ticksPerSecond)) {
      const w = WEAPONS.galho;
      const a = Math.atan2(sw.dirY, sw.dirX);
      const half = (w.arcDegrees / 2) * (Math.PI / 180);
      g.lineStyle(COMBAT_VIEW.arcLineWidthPx, COMBAT_VIEW.arcColor, 1);
      g.beginPath();
      g.arc(st.player.x, st.player.y, w.reachTiles * WORLD.tilePx, a - half, a + half);
      g.strokePath();
    }
    const p = st.player;
    this.hpText.setText(`Vida ${p.hp}/${ENZO_COMBAT.maxHp}${p.fainted ? " - DESMAIOU" : ""}`);
  }
}
