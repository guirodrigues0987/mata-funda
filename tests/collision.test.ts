import { describe, it, expect } from "vitest";
import { boxOverlapsBlocked, createInitialState, isTileBlocked, run, step } from "../src/sim";
import type { Command, GameState } from "../src/sim";
import { PLAYER } from "../src/data/player";
import { TEST_MAP } from "../src/data/testMap";
import { WORLD } from "../src/data/world";
import { FREE_MAP } from "./freeMap";

const T = WORLD.tilePx;
const HW = PLAYER.halfWidthTiles * T;
const HH = PLAYER.halfHeightTiles * T;
const DIRS: Command[] = [];
for (const mx of [-1, 0, 1] as const) for (const my of [-1, 0, 1] as const) if (mx || my) DIRS.push({ moveX: mx, moveY: my });

const SMALL = { rows: ["#####", "#...#", "#...#", "#...#", "#####"], spawn: { col: 2, row: 2 } };

function never(map: { rows: readonly string[] }, start: GameState, cmd: Command) {
  let s = start;
  for (let i = 0; i < 60; i++) {
    s = step(s, cmd, map);
    expect(boxOverlapsBlocked(map, s.player.x, s.player.y, HW, HH)).toBe(false);
  }
}

describe("colisao", () => {
  it("fora da grade conta como bloqueado", () => {
    expect(isTileBlocked(SMALL, -1, 0)).toBe(true);
    expect(isTileBlocked(SMALL, 0, 9)).toBe(true);
    expect(isTileBlocked(SMALL, 2, 2)).toBe(false);
  });
  it.each(DIRS.map((d) => [`${d.moveX},${d.moveY}`, d] as const))("mapa pequeno: 60 ticks contra a parede (%s)", (_n, cmd) => {
    never(SMALL, createInitialState(SMALL), cmd);
  });
  it.each(DIRS.map((d) => [`${d.moveX},${d.moveY}`, d] as const))("TEST_MAP: spawn e junto a obstaculo (%s)", (_n, cmd) => {
    never(TEST_MAP, createInitialState(), cmd);
    // obstaculo solto da sala em col 20, row 6: ponto logo ao lado dele
    const near: GameState = { ...createInitialState(), player: { x: 20 * T - HW - 1, y: 6.5 * T } };
    expect(boxOverlapsBlocked(TEST_MAP, near.player.x, near.player.y, HW, HH)).toBe(false);
    never(TEST_MAP, near, cmd);
  });
  it("espaco livre: 320 px em 60 ticks, reto e diagonal", () => {
    const s0 = createInitialState(FREE_MAP);
    const r = run(s0, Array.from({ length: 60 }, () => ({ moveX: 1, moveY: 0 }) as Command), FREE_MAP);
    expect(r.player.x - s0.player.x).toBeCloseTo(320, 3);
    const d = run(s0, Array.from({ length: 60 }, () => ({ moveX: 1, moveY: 1 }) as Command), FREE_MAP);
    expect(Math.hypot(d.player.x - s0.player.x, d.player.y - s0.player.y)).toBeCloseTo(320, 3);
  });
  it("desliza na parede em diagonal", () => {
    const s0 = createInitialState(SMALL);
    const s = run(s0, Array.from({ length: 60 }, () => ({ moveX: 1, moveY: 1 }) as Command), SMALL);
    expect(s.player.x).toBeGreaterThan(s0.player.x);
  });
  it("determinismo", () => {
    const cmds: Command[] = Array.from({ length: 300 }, (_, i) => DIRS[(i * 7 + (i >> 3)) % DIRS.length]);
    const a = run(createInitialState(), cmds);
    const b = run(createInitialState(), cmds);
    expect(a).toEqual(b);
  });
  it("dado do mapa consistente", () => {
    const rows = TEST_MAP.rows;
    expect(rows.every((r) => r.length === rows[0].length)).toBe(true);
    expect(rows[0].length * T).toBeGreaterThan(1920);
    expect(rows.length * T).toBeGreaterThan(1080);
    expect(isTileBlocked(TEST_MAP, TEST_MAP.spawn.col, TEST_MAP.spawn.row)).toBe(false);
    let isolated = 0;
    for (let r = 1; r < rows.length - 1; r++)
      for (let c = 1; c < rows[0].length - 1; c++)
        if (rows[r][c] === "#" && [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([dc, dr]) => rows[r + dr][c + dc] === ".")) isolated++;
    expect(isolated).toBeGreaterThanOrEqual(4);
  });
});
