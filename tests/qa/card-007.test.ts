import { describe, it, expect } from "vitest";
import { createInitialState, run, isDodging, touchHazard } from "../../src/sim";
import type { Command } from "../../src/sim";
import { WORLD } from "../../src/data/world";
import { FREE_MAP } from "../freeMap";

const roll: Command = { moveX: 0, moveY: -1, dodge: true };
const hold: Command = { moveX: 0, moveY: -1 };
const rep = (c: Command, n: number) => Array.from({ length: n }, () => c);

describe("QA card 007", () => {
  it("rola 3 tiles para cima em 15 ticks (0,25 s)", () => {
    const s0 = createInitialState(FREE_MAP);
    const s = run(s0, [roll, ...rep(hold, 14)], FREE_MAP);
    expect(s0.player.y - s.player.y).toBeCloseTo(3 * WORLD.tilePx, 5);
    expect(isDodging(s)).toBe(false);
  });
  it("hazard sobre o Enzo: sem dano rolando, com dano antes e depois", () => {
    const s0 = createInitialState(FREE_MAP);
    const hz = { x: s0.player.x, y: s0.player.y, radiusPx: 1e6, damage: 1 };
    expect(touchHazard(s0, hz).player.hp).toBe(s0.player.hp - 1);
    const mid = run(s0, [roll], FREE_MAP);
    expect(isDodging(mid)).toBe(true);
    expect(touchHazard(mid, hz).player.hp).toBe(s0.player.hp);
    const end = run(s0, [roll, ...rep(hold, 14)], FREE_MAP);
    expect(touchHazard(end, hz).player.hp).toBe(s0.player.hp - 1);
  });
  it("recarga: aperto no tick 47 nao rola, no 48 rola", () => {
    const s0 = createInitialState(FREE_MAP);
    const a = run(s0, [roll, ...rep(hold, 46), roll], FREE_MAP);
    expect(isDodging(a)).toBe(false);
    const b = run(s0, [roll, ...rep(hold, 47), roll], FREE_MAP);
    expect(isDodging(b)).toBe(true);
  });
});
