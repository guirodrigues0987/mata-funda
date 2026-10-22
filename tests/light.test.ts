import { describe, it, expect } from "vitest";
import { createInitialState, run, isLit, lightRadiusPx } from "../src/sim";
import type { Command } from "../src/sim";
import { PLAYER } from "../src/data/player";
import { TEST_SCENE } from "../src/data/testScene";

const O = { x: 0, y: 0 };
const R = 256;
const sq = (x: number, y: number, s = 10) => ({ x, y, width: s, height: s });

describe("luz", () => {
  it("raio em px vem dos dados", () => expect(lightRadiusPx()).toBe(256));
  it("dentro e fora", () => {
    expect(isLit(O, { x: 200, y: 0, width: 20, height: 20 }, R)).toBe(true);
    expect(isLit(O, { x: 400, y: 0, width: 20, height: 20 }, R)).toBe(false);
  });
  it("limite exato", () => {
    expect(isLit(O, { x: 261, y: 0, width: 10, height: 10 }, R)).toBe(true);
    expect(isLit(O, { x: 262, y: 0, width: 10, height: 10 }, R)).toBe(false);
  });
  it("diagonal usa o canto mais proximo", () => {
    expect(isLit(O, sq(170, 170), R)).toBe(true);
    expect(isLit(O, sq(200, 200), R)).toBe(false);
  });
  it("acompanha o Enzo andando", () => {
    const cmd: Command = { moveX: 1, moveY: 0 };
    const s = run(createInitialState(), Array.from({ length: 60 }, () => cmd));
    expect(isLit(O, sq(450, 0), R)).toBe(false);
    expect(isLit(s.player, sq(450, 0), R)).toBe(true);
    expect(isLit(O, sq(-200, 0), R)).toBe(true);
    expect(isLit(s.player, sq(-200, 0), R)).toBe(false);
  });
  it("cenario de teste", () => {
    const o = { x: PLAYER.startX, y: PLAYER.startY };
    const lit = TEST_SCENE.shapes.filter((s) => isLit(o, s, R));
    expect(TEST_SCENE.shapes.length).toBeGreaterThanOrEqual(5);
    expect(lit.length).toBeGreaterThanOrEqual(1);
    expect(TEST_SCENE.shapes.length - lit.length).toBeGreaterThanOrEqual(3);
  });
});
