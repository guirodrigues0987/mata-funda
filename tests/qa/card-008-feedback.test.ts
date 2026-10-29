import { describe, it, expect } from "vitest";
import { advanceClock, createClock, createInitialState } from "../../src/sim";
import { step } from "../../src/sim";
import type { Clock, GameState } from "../../src/sim";
import { consumeClick } from "../../src/render/clickPulse";
import { readCommand } from "../../src/render/readCommand";
import { hitFeedbackView } from "../../src/render/hitFeedback";
import type { HitFeedbackView } from "../../src/render/hitFeedback";
import { COMBAT_VIEW, TRAINING_DUMMY, WEAPONS } from "../../src/data/combat";

// Reproduz GameScene.update: clique -> consumeClick -> readCommand -> step; a cada quadro, hitFeedbackView.
function start(distToDummy: number): GameState {
  const s = createInitialState();
  const d = s.dummies[0];
  return { ...s, player: { ...s.player, x: d.x - distToDummy, y: d.y } };
}
function frames(s0: GameState, deltas: number[], clicks: Set<number>, aimX: number, aimY: number) {
  let s = s0;
  let clock: Clock = createClock();
  let pending = false;
  const views: HitFeedbackView[] = [];
  for (let f = 0; f < deltas.length; f++) {
    if (clicks.has(f)) pending = true;
    const adv = advanceClock(clock, deltas[f]);
    clock = adv.clock;
    const c = consumeClick(pending, adv.ticks);
    pending = c.pending;
    let pulse = c.pulse;
    for (let i = 0; i < adv.ticks; i++) {
      s = step(s, readCommand({ left: false, right: false, up: false, down: false, toggleLight: false, dodge: false, attack: pulse, aimX, aimY }));
      pulse = false;
    }
    views.push(hitFeedbackView(s));
  }
  return { s, views };
}
const hz = (n: number, count: number) => Array.from({ length: count }, () => 1000 / n);

describe("QA 008: clique -> dano -> lastHit -> view (quadros sem tick)", () => {
  it("144 Hz, clique em qualquer quadro: pisca, mostra 2, vida 4/6", () => {
    for (let click = 0; click < 10; click++) {
      const { s, views } = frames(start(50), hz(144, 20), new Set([click]), 1, 0);
      expect(s.dummies[0].hp).toBe(TRAINING_DUMMY.hp - WEAPONS.galho.damage);
      expect(views.some((v) => v.flashTargetId === s.dummies[0].id), `clique ${click}`).toBe(true);
      expect(views.some((v) => v.damageText?.text === "2")).toBe(true);
      expect(views[views.length - 1].hp[0]).toMatchObject({ cur: 4, max: 6 });
    }
  });
  it("vida mostrada 6 -> 4 -> 2 e golpe fatal mostra numero sem alvo", () => {
    const d = hz(144, 200);
    const clicks = new Set([2, 60, 120]); // ~0,4 s = 58 quadros a 144 Hz
    const { s, views } = frames(start(50), d, clicks, 1, 0);
    const curs = views.map((v) => v.hp[0]?.cur);
    expect(curs).toContain(6);
    expect(curs).toContain(4);
    expect(curs).toContain(2);
    expect(s.dummies).toHaveLength(0);
    const after = views.findIndex((v) => v.hp.length === 0);
    expect(after).toBeGreaterThan(0);
    expect(views[after].damageText?.text).toBe("2");
    expect(views[after].flashTargetId).toBeNull();
    expect(s.lastHit?.damage).toBe(2);
  });
  it("erro (fora do alcance e fora do arco): sem piscar, sem numero, vida igual, arco gravado", () => {
    for (const [dist, ax, ay] of [[100, 1, 0], [50, -1, 0], [50, 0, 1]] as const) {
      const { s, views } = frames(start(dist), hz(144, 20), new Set([1]), ax, ay);
      expect(s.lastSwing).not.toBeNull();
      expect(s.lastHit).toBeNull();
      expect(s.dummies[0].hp).toBe(6);
      for (const v of views) {
        expect(v.flashTargetId).toBeNull();
        expect(v.damageText).toBeNull();
        expect(v.hp[0].cur).toBe(6);
      }
    }
  });
  it("piscar e numero expiram", () => {
    const { views } = frames(start(50), hz(60, 120), new Set([1]), 1, 0);
    expect(views[10].flashTargetId).not.toBeNull();
    expect(views[10].damageText).not.toBeNull();
    expect(views[119].flashTargetId).toBeNull();
    expect(views[119].damageText).toBeNull();
    expect(COMBAT_VIEW.hitFlashColor).not.toBe(COMBAT_VIEW.dummyColor);
  });
});
