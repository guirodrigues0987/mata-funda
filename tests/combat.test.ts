import { describe, expect, it } from "vitest";
import { ENZO_COMBAT, WEAPONS } from "../src/data/combat";
import { createInitialState, damagePlayer, run, step } from "../src/sim";
import type { Command, GameState } from "../src/sim";
import { FREE_MAP } from "./freeMap";

const TILE = 64;
const idle: Command = { moveX: 0, moveY: 0 };
const hit = (aimX: number, aimY: number): Command => ({ moveX: 0, moveY: 0, attack: true, aimX, aimY });
const rep = (n: number): Command[] => Array.from({ length: n }, () => idle);

function withDummy(dx: number, dy: number, hp = 6): GameState {
  const s = createInitialState(FREE_MAP);
  return { ...s, dummies: [{ id: "t", x: s.player.x + dx, y: s.player.y + dy, hp }] };
}
const deg = (d: number, r: number) => [Math.cos((d * Math.PI) / 180) * r, Math.sin((d * Math.PI) / 180) * r] as const;
const hpAfter = (s: GameState, c: Command) => step(s, c, FREE_MAP).dummies[0]?.hp;

describe("golpe do Galho", () => {
  it("acerta a 1 tile na direcao do aim", () => expect(hpAfter(withDummy(TILE, 0), hit(1, 0))).toBe(4));
  it("nao acerta a 1,5 tile", () => expect(hpAfter(withDummy(96, 0), hit(1, 0))).toBe(6));
  it("nao acerta alvo atras", () => expect(hpAfter(withDummy(-32, 0), hit(1, 0))).toBe(6));
  it("arco: 40 graus acerta, 50 nao", () => {
    expect(hpAfter(withDummy(...deg(40, 50)), hit(1, 0))).toBe(4);
    expect(hpAfter(withDummy(...deg(50, 50)), hit(1, 0))).toBe(6);
  });
  it("aim para baixo acerta abaixo e nao a direita", () => {
    expect(hpAfter(withDummy(0, 50), hit(0, 5))).toBe(4);
    expect(hpAfter(withDummy(50, 0), hit(0, 5))).toBe(6);
  });
  it("cooldown: 23 ticks um golpe, 24 ticks dois", () => {
    const go = (gap: number) => run(withDummy(32, 0), [hit(1, 0), ...rep(gap - 1), hit(1, 0)], FREE_MAP).dummies[0]?.hp;
    expect(go(23)).toBe(4);
    expect(go(24)).toBe(2);
  });
  it("tres golpes removem o alvo", () => {
    const c = [hit(1, 0), ...rep(23), hit(1, 0), ...rep(23), hit(1, 0)];
    expect(run(withDummy(32, 0), c, FREE_MAP).dummies).toHaveLength(0);
  });
  it("sem attack nunca golpeia", () => {
    const s = run(withDummy(32, 0), [idle, { moveX: 0, moveY: 0, attack: false, aimX: 1, aimY: 0 }], FREE_MAP);
    expect(s.dummies[0]?.hp).toBe(6);
    expect(s.lastSwing).toBeNull();
  });
  it("aim zero usa a direcao anterior", () => {
    const s = run(withDummy(0, 40), [hit(0, 1), ...rep(24), hit(0, 0)], FREE_MAP);
    expect(s.dummies[0]?.hp).toBe(2);
  });
});

describe("vida do Enzo", () => {
  it("dano, invulnerabilidade de 60 ticks e novo dano", () => {
    const a = damagePlayer(createInitialState(FREE_MAP), 3);
    expect(a.player.hp).toBe(7);
    expect(a.player.invulnerableTicks).toBe(60);
    expect(damagePlayer(a, 3).player.hp).toBe(7);
    expect(damagePlayer(run(a, rep(60), FREE_MAP), 3).player.hp).toBe(4);
  });
  it("vida nunca negativa, desmaia e nao golpeia", () => {
    const a = damagePlayer(withDummy(32, 0), 99);
    expect(a.player.hp).toBe(0);
    expect(a.player.fainted).toBe(true);
    expect(step(a, hit(1, 0), FREE_MAP).dummies[0]?.hp).toBe(6);
  });
  it("valores vem de src/data", () => {
    expect(WEAPONS.galho).toEqual({ damage: 2, intervalSeconds: 0.4, reachTiles: 1, arcDegrees: 90 });
    expect(ENZO_COMBAT).toEqual({ maxHp: 10, invulnerableSeconds: 1 });
    expect(createInitialState().player.hp).toBe(10);
  });
});
