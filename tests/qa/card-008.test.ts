import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { advanceClock, createClock, createInitialState, step } from "../../src/sim";
import type { Clock, GameState } from "../../src/sim";
import { consumeClick } from "../../src/render/clickPulse";
import { readCommand } from "../../src/render/readCommand";
import { RENDER } from "../../src/data/render";
import { TRAINING_DUMMY } from "../../src/data/combat";

// Reproduz o laco de GameScene.update com intervalos de quadro reais (sem tick em alguns quadros).
function playFrames(deltas: number[], clickAtFrame: number, aim: { x: number; y: number }) {
  let s: GameState = createInitialState();
  let clock: Clock = createClock();
  let pending = false;
  for (let f = 0; f < deltas.length; f++) {
    if (f === clickAtFrame) pending = true;
    const adv = advanceClock(clock, deltas[f]);
    clock = adv.clock;
    const c = consumeClick(pending, adv.ticks);
    pending = c.pending;
    let pulse = c.pulse;
    for (let i = 0; i < adv.ticks; i++) {
      s = step(s, readCommand({ left: false, right: false, up: false, down: false, toggleLight: false, dodge: false, attack: pulse, aimX: aim.x, aimY: aim.y }));
      pulse = false;
    }
  }
  return s;
}

describe("QA card 008: clique ao dano", () => {
  const aimAtDummy = { x: TRAINING_DUMMY.offsetX, y: 0 };

  it("monitor 144 Hz (quadros de ~6,9 ms): clique cai em quadro sem tick e ainda gera golpe", () => {
    const deltas = Array.from({ length: 30 }, () => 1000 / 144);
    for (let click = 0; click < 12; click++) {
      const s = playFrames(deltas, click, aimAtDummy);
      expect(s.lastSwing, `clique no quadro ${click}`).not.toBeNull();
    }
  });
  it("monitor 240 Hz: um clique gera exatamente um golpe", () => {
    const deltas = Array.from({ length: 60 }, () => 1000 / 240);
    const s = playFrames(deltas, 1, aimAtDummy);
    expect(s.lastSwing).not.toBeNull();
    expect(s.lastSwing!.tick).toBeGreaterThan(0);
  });
  it("clique em quadro sem tick, depois quadros com tick: golpe sai uma unica vez (sem fila de golpes)", () => {
    const s = playFrames([1, 1, 1, 20, 20, 20, 20], 0, aimAtDummy);
    expect(s.lastSwing).not.toBeNull();
    expect(s.lastSwing!.tick).toBe(1);
  });
  it("golpe pelo caminho completo fere o alvo de treino quando ele esta ao alcance", () => {
    const base = createInitialState();
    let s: GameState = { ...base, dummies: [{ ...base.dummies[0], x: base.player.x + 60, y: base.player.y }] };
    let clock = createClock();
    let pending = true;
    for (const d of [2, 3, 17, 17]) {
      const adv = advanceClock(clock, d);
      clock = adv.clock;
      const c = consumeClick(pending, adv.ticks);
      pending = c.pending;
      let pulse = c.pulse;
      for (let i = 0; i < adv.ticks; i++) {
        s = step(s, readCommand({ left: false, right: false, up: false, down: false, toggleLight: false, dodge: false, attack: pulse, aimX: 100, aimY: 0 }));
        pulse = false;
      }
    }
    expect(s.dummies[0].hp).toBe(base.dummies[0].hp - 2);
  });
});

describe("QA card 008: ordem das camadas", () => {
  it("mapa < combate < Enzo e todos < HUD", () => {
    expect(RENDER.depth.map).toBeLessThan(RENDER.depth.combat);
    expect(RENDER.depth.combat).toBeLessThan(RENDER.depth.enzo);
    expect(RENDER.depth.enzo).toBeLessThan(RENDER.hud.depth);
  });
  it("GameScene aplica as camadas ao grafico de combate, ao mapa e ao Enzo", () => {
    const src = readFileSync("src/render/GameScene.ts", "utf8");
    expect(src).toMatch(/combatGfx\s*=\s*this\.add\.graphics\(\)\.setDepth\(RENDER\.depth\.combat\)/);
    expect(src).toMatch(/createMapView\(this\)\.forEach\(\(t\) => t\.setDepth\(RENDER\.depth\.map\)\)/);
    expect(src).toMatch(/createEnzoView\(this\)\.setDepth\(RENDER\.depth\.enzo\)/);
  });
  it("GameScene so limpa o clique via consumeClick (nunca zera direto)", () => {
    const src = readFileSync("src/render/GameScene.ts", "utf8");
    expect(src).toMatch(/consumeClick\(this\.clicked, advanced\.ticks\)/);
    expect(src).not.toMatch(/this\.clicked\s*=\s*false/);
  });
});
