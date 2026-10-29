import { describe, it, expect } from "vitest";
import { createInitialState, run } from "../src/sim";
import type { Command } from "../src/sim";
import { PLAYER } from "../src/data/player";
import { WORLD } from "../src/data/world";
import { FREE_MAP } from "./freeMap";
import { readCommand } from "../src/render/readCommand";

const PX = PLAYER.speedTilesPerSecond * WORLD.tilePx;
const none = { left: false, right: false, up: false, down: false, toggleLight: false, dodge: false };

function walk(cmd: Command, n = 60) {
  const s0 = createInitialState(FREE_MAP);
  const s = run(s0, Array.from({ length: n }, () => cmd), FREE_MAP);
  return { dx: s.player.x - s0.player.x, dy: s.player.y - s0.player.y };
}

describe("movimento do Enzo", () => {
  it("velocidade vem dos dados", () => {
    expect(PX).toBe(320);
  });
  it.each([
    ["direita", { moveX: 1, moveY: 0 }, PX, 0],
    ["esquerda", { moveX: -1, moveY: 0 }, -PX, 0],
    ["baixo", { moveX: 0, moveY: 1 }, 0, PX],
    ["cima", { moveX: 0, moveY: -1 }, 0, -PX],
  ] as const)("reta %s: 5 tiles em 60 ticks", (_n, cmd, ex, ey) => {
    const { dx, dy } = walk(cmd);
    expect(dx).toBeCloseTo(ex, 6);
    expect(dy).toBeCloseTo(ey, 6);
  });
  it.each([
    [1, -1],
    [-1, -1],
    [1, 1],
    [-1, 1],
  ] as const)("diagonal (%i,%i) mantem 5 tiles/s", (mx, my) => {
    const { dx, dy } = walk({ moveX: mx, moveY: my });
    expect(Math.hypot(dx, dy)).toBeCloseTo(PX, 6);
    expect(Math.sign(dx)).toBe(mx);
    expect(Math.sign(dy)).toBe(my);
  });
  it("parado sem teclas", () => {
    expect(walk(readCommand(none))).toEqual({ dx: 0, dy: 0 });
  });
  it("teclas opostas se anulam", () => {
    expect(readCommand({ ...none, up: true, down: true }).moveY).toBe(0);
    expect(readCommand({ ...none, left: true, right: true }).moveX).toBe(0);
    expect(walk(readCommand({ ...none, up: true, down: true, left: true, right: true }))).toEqual({ dx: 0, dy: 0 });
  });
});
