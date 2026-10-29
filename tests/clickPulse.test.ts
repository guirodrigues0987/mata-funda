import { describe, it, expect } from "vitest";
import { consumeClick } from "../src/render/clickPulse";
import { readCommand } from "../src/render/readCommand";
import { createInitialState, step } from "../src/sim";
import type { GameState } from "../src/sim";

describe("clique pendente", () => {
  it("quadro sem tick mantem o clique", () => {
    expect(consumeClick(true, 0)).toEqual({ pulse: false, pending: true });
  });
  it("quadro com tick consome o clique", () => {
    expect(consumeClick(true, 1)).toEqual({ pulse: true, pending: false });
    expect(consumeClick(true, 3)).toEqual({ pulse: true, pending: false });
  });
  it("sem clique nunca gera pulso", () => {
    expect(consumeClick(false, 2)).toEqual({ pulse: false, pending: false });
    expect(consumeClick(false, 0)).toEqual({ pulse: false, pending: false });
  });
  it("fluxo: clique em quadro sem tick, golpe acontece no quadro seguinte e fere o alvo", () => {
    let pending = true;
    const base = createInitialState();
    let s: GameState = { ...base, dummies: [{ ...base.dummies[0], x: base.player.x + 48, y: base.player.y }] };
    const hp0 = s.dummies[0].hp;
    const frames = [0, 0, 1];
    for (const ticks of frames) {
      const c = consumeClick(pending, ticks);
      pending = c.pending;
      let pulse = c.pulse;
      for (let i = 0; i < ticks; i++) {
        s = step(s, readCommand({ left: false, right: false, up: false, down: false, toggleLight: false, dodge: false, attack: pulse, aimX: 1, aimY: 0 }));
        pulse = false;
      }
    }
    expect(s.lastSwing).not.toBeNull();
    expect(s.dummies[0].hp).toBeLessThan(hp0);
  });
});
