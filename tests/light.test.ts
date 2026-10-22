import { describe, it, expect } from "vitest";
import { createInitialState, run, isLit, lightRadiusPx, isTileBlocked } from "../src/sim";
import type { Command } from "../src/sim";
import { TEST_MAP } from "../src/data/testMap";
import { WORLD } from "../src/data/world";
import { FREE_MAP } from "./freeMap";

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
    const s = run(createInitialState(FREE_MAP), Array.from({ length: 60 }, () => cmd), FREE_MAP);
    const o = createInitialState(FREE_MAP).player;
    const at = (dx: number) => sq(o.x + dx, o.y);
    expect(isLit(o, at(450), R)).toBe(false);
    expect(isLit(s.player, at(450), R)).toBe(true);
    expect(isLit(o, at(-200), R)).toBe(true);
    expect(isLit(s.player, at(-200), R)).toBe(false);
  });
  it("cenario de teste (tiles bloqueados do mapa)", () => {
    const t = WORLD.tilePx;
    const shapes: { x: number; y: number; width: number; height: number }[] = [];
    TEST_MAP.rows.forEach((line, r) => {
      for (let c = 0; c < line.length; c++) {
        if (isTileBlocked(TEST_MAP, c, r)) shapes.push({ x: (c + 0.5) * t, y: (r + 0.5) * t, width: t, height: t });
      }
    });
    const o = createInitialState().player;
    const lit = shapes.filter((s) => isLit(o, s, R));
    expect(lit.length).toBeGreaterThanOrEqual(1);
    expect(shapes.length - lit.length).toBeGreaterThanOrEqual(3);
  });
});
