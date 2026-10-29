import { describe, expect, it } from "vitest";
import { COMBAT_VIEW, TRAINING_DUMMY, WEAPONS } from "../src/data/combat";
import { createInitialState, run, step } from "../src/sim";
import type { Command, GameState } from "../src/sim";
import { hitFeedbackView } from "../src/render/hitFeedback";
import { FREE_MAP } from "./freeMap";

const idle: Command = { moveX: 0, moveY: 0 };
const hit = (aimX = 1, aimY = 0): Command => ({ moveX: 0, moveY: 0, attack: true, aimX, aimY });
const rep = (n: number): Command[] => Array.from({ length: n }, () => idle);
function withDummy(dx: number, dy: number, hp = 6): GameState {
  const s = createInitialState(FREE_MAP);
  return { ...s, dummies: [{ id: "t", x: s.player.x + dx, y: s.player.y + dy, hp }] };
}
const deg = (d: number, r: number) => [Math.cos((d * Math.PI) / 180) * r, Math.sin((d * Math.PI) / 180) * r] as const;

describe("feedback de acerto (simulacao)", () => {
  it("inicia nulo", () => expect(createInitialState().lastHit).toBeNull());

  it("acerto grava lastHit", () => {
    const s = step(withDummy(64, 0), hit(), FREE_MAP);
    const d = s.dummies[0]!;
    expect(s.lastHit).toEqual({ tick: s.tick, targetId: "t", x: d.x, y: d.y, damage: WEAPONS.galho.damage });
    expect(s.lastHit?.damage).toBe(2);
  });

  it.each([
    ["1,5 tile", [96, 0]],
    ["180 graus", [-32, 0]],
    ["50 graus", deg(50, 50)],
  ] as const)("erro (%s): sem lastHit, vida igual, arco aparece", (_n, [dx, dy]) => {
    const s = step(withDummy(dx, dy), hit(), FREE_MAP);
    expect(s.lastHit).toBeNull();
    expect(s.dummies[0]?.hp).toBe(6);
    expect(s.lastSwing).not.toBeNull();
  });

  it("acerto seguido de erro preserva o primeiro lastHit", () => {
    const a = step(withDummy(64, 0), hit(), FREE_MAP);
    const b = run(a, [...rep(23), hit(-1, 0)], FREE_MAP);
    expect(b.lastSwing?.tick).toBeGreaterThan(a.lastSwing!.tick);
    expect(b.lastHit).toEqual(a.lastHit);
  });

  it("dois acertos: lastHit avanca e vida 6 -> 4 -> 2", () => {
    const a = step(withDummy(32, 0), hit(), FREE_MAP);
    expect(a.dummies[0]?.hp).toBe(4);
    const b = run(a, [...rep(23), hit()], FREE_MAP);
    expect(b.dummies[0]?.hp).toBe(2);
    expect(b.lastHit!.tick).toBeGreaterThan(a.lastHit!.tick);
    expect(b.lastHit!.tick).toBe(b.tick);
  });

  it("golpe fatal: alvo removido, lastHit guarda posicao e dano", () => {
    const s0 = withDummy(32, 0);
    const s = run(s0, [hit(), ...rep(23), hit(), ...rep(23), hit()], FREE_MAP);
    expect(s.dummies).toHaveLength(0);
    expect(s.lastHit).toMatchObject({ targetId: "t", x: s0.dummies[0]!.x, y: s0.dummies[0]!.y, damage: 2 });
  });

  it("cooldown, attack ausente/false e desmaio nao mudam lastHit", () => {
    const a = step(withDummy(32, 0), hit(), FREE_MAP);
    expect(run(a, [...rep(5), hit()], FREE_MAP).lastHit).toEqual(a.lastHit);
    expect(run(a, [...rep(30), { ...idle, attack: false, aimX: 1, aimY: 0 }], FREE_MAP).lastHit).toEqual(a.lastHit);
    const f = withDummy(32, 0);
    const fainted = { ...f, player: { ...f.player, fainted: true } };
    expect(step(fainted, hit(), FREE_MAP).lastHit).toBeNull();
  });

  it("dados de feedback", () => {
    expect(COMBAT_VIEW.hitFlashSeconds).toBeGreaterThan(0);
    expect(COMBAT_VIEW.damageTextSeconds).toBeGreaterThan(0);
    expect(COMBAT_VIEW.hitFlashColor).not.toBe(COMBAT_VIEW.dummyColor);
  });
});

describe("hitFeedbackView (o que o render desenha)", () => {
  it("antes de qualquer golpe: sem piscar nem numero, vida cheia", () => {
    const v = hitFeedbackView(withDummy(64, 0));
    expect(v.flashTargetId).toBeNull();
    expect(v.damageText).toBeNull();
    expect(v.hp[0]).toMatchObject({ cur: 6, max: TRAINING_DUMMY.hp });
  });

  it("acerto: pisca, mostra '2' e vida 4/6; depois some", () => {
    const s = step(withDummy(64, 0), hit(), FREE_MAP);
    const v = hitFeedbackView(s);
    expect(v.flashTargetId).toBe("t");
    expect(v.damageText?.text).toBe("2");
    expect(v.hp[0]).toMatchObject({ cur: 4, max: 6 });
    const flashEnd = run(s, rep(Math.round(COMBAT_VIEW.hitFlashSeconds * 60) + 1), FREE_MAP);
    expect(hitFeedbackView(flashEnd).flashTargetId).toBeNull();
    expect(hitFeedbackView(flashEnd).damageText).not.toBeNull();
    const textEnd = run(s, rep(Math.round(COMBAT_VIEW.damageTextSeconds * 60) + 1), FREE_MAP);
    expect(hitFeedbackView(textEnd).damageText).toBeNull();
  });

  it("erro: nada de novo; acerto e depois erro nao reinicia o piscar", () => {
    const miss = step(withDummy(96, 0), hit(), FREE_MAP);
    const v = hitFeedbackView(miss);
    expect(v.flashTargetId).toBeNull();
    expect(v.damageText).toBeNull();
    expect(v.hp[0]?.cur).toBe(6);
  });

  it("golpe fatal: numero aparece, sem barra nem piscar do alvo removido", () => {
    const s = run(withDummy(32, 0, 2), [hit()], FREE_MAP);
    const v = hitFeedbackView(s);
    expect(v.hp).toHaveLength(0);
    expect(v.flashTargetId).toBeNull();
    expect(v.damageText?.text).toBe("2");
  });
});
