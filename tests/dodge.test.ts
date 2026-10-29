import { describe, it, expect } from "vitest";
import { createInitialState, run, step, isDodging, touchHazard } from "../src/sim";
import type { Command, GameState } from "../src/sim";
import { PLAYER } from "../src/data/player";
import { TEST_HAZARD } from "../src/data/testHazard";
import { WORLD } from "../src/data/world";
import { readCommand } from "../src/render/readCommand";
import { FREE_MAP } from "./freeMap";

const TILE = WORLD.tilePx;
const WALK = (PLAYER.speedTilesPerSecond * TILE) / 60;
const right: Command = { moveX: 1, moveY: 0 };
const rollRight: Command = { moveX: 1, moveY: 0, dodge: true };
const idle: Command = { moveX: 0, moveY: 0 };

const s0 = () => createInitialState(FREE_MAP);
const advance = (s: GameState, cmds: readonly Command[]) => run(s, cmds, FREE_MAP);
const rep = (c: Command, n: number) => Array.from({ length: n }, () => c);

describe("esquiva", () => {
  it("3 tiles em exatamente 15 ticks, depois volta a andar normal", () => {
    const a = s0();
    const r = advance(a, [rollRight, ...rep(idle, 14)]);
    expect(r.player.x - a.player.x).toBeCloseTo(3 * TILE, 6);
    expect(isDodging(r)).toBe(false);
    const n = advance(r, [right]);
    expect(n.player.x - r.player.x).toBeCloseTo(WALK, 6);
  });
  it.each([
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ] as const)("distancia 192 px na direcao (%i,%i), fixa mesmo se o comando mudar", (mx, my) => {
    const a = s0();
    const r = advance(a, [
      { moveX: mx, moveY: my, dodge: true },
      ...rep({ moveX: (-mx || 1) as -1 | 1, moveY: 0 }, 14),
    ]);
    const dx = r.player.x - a.player.x;
    const dy = r.player.y - a.player.y;
    expect(Math.hypot(dx, dy)).toBeCloseTo(3 * TILE, 6);
    expect(Math.sign(Math.round(dx))).toBe(mx);
    expect(Math.sign(Math.round(dy))).toBe(my);
  });
  it("invulneravel nos ticks 0..14 e vulneravel antes e depois", () => {
    const base = s0();
    const hz = { ...TEST_HAZARD, x: base.player.x, y: base.player.y, radiusPx: 10000 };
    expect(touchHazard(base, hz).player.hp).toBe(PLAYER.maxHp - hz.damage);
    let s = base;
    for (let t = 0; t < 15; t++) {
      s = step(s, t === 0 ? rollRight : idle, FREE_MAP);
      // estado apos o tick t: rolando ate o ultimo tick; checa o estado durante o rolamento
      if (t < 14) expect(touchHazard(s, hz).player.hp).toBe(PLAYER.maxHp);
    }
    // apos 15 ticks o rolamento terminou
    expect(isDodging(s)).toBe(false);
    expect(touchHazard(s, hz).player.hp).toBe(PLAYER.maxHp - hz.damage);
  });
  it("invulneravel ao encostar durante o rolamento (alvo no caminho)", () => {
    const base = s0();
    const hz = { ...TEST_HAZARD, x: base.player.x + TILE, y: base.player.y, radiusPx: 20 };
    let s = base;
    let hp = s.player.hp;
    for (let t = 0; t < 15; t++) {
      s = step(s, t === 0 ? rollRight : idle, FREE_MAP);
      s = touchHazard(s, hz);
    }
    hp = s.player.hp;
    expect(hp).toBe(PLAYER.maxHp);
  });
  it("intervalo: tick 47 nao inicia, tick 48 inicia", () => {
    const at = (gap: number) => {
      const s = advance(s0(), [rollRight, ...rep(right, gap - 1)]);
      return step(s, rollRight, FREE_MAP);
    };
    expect(isDodging(at(47))).toBe(false);
    expect(isDodging(at(48))).toBe(true);
  });
  it("Espaco parado nao rola nem gasta recarga", () => {
    const a = s0();
    const s = advance(a, [{ moveX: 0, moveY: 0, dodge: true }]);
    expect(isDodging(s)).toBe(false);
    expect(s.player.x).toBe(a.player.x);
    expect(s.player.dodge.cooldownLeft).toBe(0);
    expect(isDodging(step(s, rollRight, FREE_MAP))).toBe(true);
  });
  it("readCommand repassa dodge", () => {
    const k = { left: false, right: false, up: false, down: false, toggleLight: false };
    expect(readCommand({ ...k, dodge: true }).dodge).toBe(true);
    expect(readCommand({ ...k, dodge: false }).dodge).toBe(false);
  });
});
