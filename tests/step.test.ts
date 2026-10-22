import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createInitialState, run, step } from "../src/sim";
import type { Command, GameState } from "../src/sim";
import { SIM } from "../src/data/sim";
import { PLAYER } from "../src/data/player";
import { WORLD } from "../src/data/world";

const right: Command = { moveX: 1, moveY: 0 };
const none: Command = { moveX: 0, moveY: 0 };

function deepFreeze<T>(o: T): T {
  Object.values(o as object).forEach((v) => typeof v === "object" && v && deepFreeze(v));
  return Object.freeze(o);
}

describe("step", () => {
  it("nao muta o estado recebido", () => {
    const s: GameState = deepFreeze(createInitialState());
    const copy = structuredClone(s);
    const next = step(s, right);
    expect(s).toEqual(copy);
    expect(next).not.toBe(s);
  });
  it("e deterministico", () => {
    const cmds = Array.from({ length: 30 }, () => right);
    const a = run(createInitialState(), cmds);
    const b = run(createInitialState(), cmds);
    expect(a).toEqual(b);
    expect(a.tick).toBe(30);
    expect(a.player.x).toBeCloseTo((30 * PLAYER.speedTilesPerSecond * WORLD.tilePx) / SIM.ticksPerSecond, 9);
  });
  it("60 ticks equivalem a 1 segundo", () => {
    const s = run(createInitialState(), Array.from({ length: 60 }, () => none));
    expect(s.tick).toBe(60);
    expect(s.tick / SIM.ticksPerSecond).toBe(1);
  });
  it("src/sim nao tem 60 literal nem relogio/aleatoriedade", () => {
    const dir = join(__dirname, "../src/sim");
    for (const f of readdirSync(dir).filter((x) => x.endsWith(".ts"))) {
      const src = readFileSync(join(dir, f), "utf8");
      expect(src, f).not.toMatch(/\b60\b/);
      expect(src, f).not.toMatch(/Date\.|performance\.|Math\.random/);
    }
  });
});
