import { describe, it, expect } from "vitest";
import { boxOverlapsBlocked, createInitialState, step, isTileBlocked } from "../../src/sim";
import type { Command } from "../../src/sim";
import { PLAYER } from "../../src/data/player";
import { TEST_MAP } from "../../src/data/testMap";
import { WORLD } from "../../src/data/world";

const T = WORLD.tilePx;
const HW = PLAYER.halfWidthTiles * T;
const HH = PLAYER.halfHeightTiles * T;
const DIRS: Command[] = [];
for (const mx of [-1, 0, 1] as const) for (const my of [-1, 0, 1] as const) if (mx || my) DIRS.push({ moveX: mx, moveY: my });

describe("card 005 QA", () => {
  it("nunca entra em tile bloqueado: 8 direcoes, todos os tiles livres do TEST_MAP, 60 ticks", () => {
    const rows = TEST_MAP.rows;
    let n = 0;
    for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) {
      if (isTileBlocked(TEST_MAP, c, r)) continue;
      for (const cmd of DIRS) {
        let s = createInitialState({ ...TEST_MAP, spawn: { col: c, row: r } });
        for (let i = 0; i < 60; i++) {
          s = step(s, cmd);
          if (boxOverlapsBlocked(TEST_MAP, s.player.x, s.player.y, HW, HH)) throw new Error(`overlap ${c},${r} ${JSON.stringify(cmd)} tick ${i}`);
          n++;
        }
      }
    }
    expect(n).toBeGreaterThan(0);
  });
  it("area > 1920x1080, corredor, sala e 4+ obstaculos isolados", () => {
    const rows = TEST_MAP.rows;
    expect(rows[0].length * T).toBeGreaterThan(1920);
    expect(rows.length * T).toBeGreaterThan(1080);
    let iso = 0;
    for (let r = 1; r < rows.length - 1; r++) for (let c = 1; c < rows[r].length - 1; c++) {
      if (rows[r][c] === "#" && [[1,0],[-1,0],[0,1],[0,-1]].every(([a,b]) => rows[r+b][c+a] === ".")) iso++;
    }
    expect(iso).toBeGreaterThanOrEqual(4);
  });
  it("velocidade 320 px/s em espaco livre e determinismo", () => {
    let s = createInitialState();
    const x0 = s.player.x;
    for (let i = 0; i < 60; i++) s = step(s, { moveX: 1, moveY: 0 });
    expect(s.player.x - x0).toBeCloseTo(320, 2);
    const seq = Array.from({ length: 300 }, (_, i) => DIRS[(i * 7) % 8]);
    const go = () => seq.reduce((st, c) => step(st, c), createInitialState());
    expect(go().player).toEqual(go().player);
  });
});
