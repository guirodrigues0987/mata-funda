import { describe, it, expect } from "vitest";
import { advanceClock, createClock } from "../src/sim";
import { SIM } from "../src/data/sim";

const TICK_MS = 1000 / SIM.ticksPerSecond;

describe("clock", () => {
  it("100 ms geram 6 ticks", () => {
    expect(advanceClock(createClock(), 100).ticks).toBe(6);
  });
  it("1000/60 ms gera 1 tick", () => {
    expect(advanceClock(createClock(), TICK_MS).ticks).toBe(1);
  });
  it("60 quadros de 1000/60 ms somam 60 ticks", () => {
    let c = createClock();
    let total = 0;
    for (let i = 0; i < 60; i++) {
      const r = advanceClock(c, TICK_MS);
      c = r.clock;
      total += r.ticks;
    }
    expect(total).toBe(60);
  });
  it("16 quadros de 10 ms: 9 ticks e resto preservado", () => {
    let c = createClock();
    let total = 0;
    for (let i = 0; i < 16; i++) {
      const r = advanceClock(c, 10);
      c = r.clock;
      total += r.ticks;
    }
    expect(total).toBe(9);
    expect(c.accumulatorMs).toBeCloseTo(10, 6);
  });
  it("delta enorme respeita o teto", () => {
    expect(advanceClock(createClock(), 5000).ticks).toBe(SIM.maxTicksPerFrame);
  });
  it("delta negativo ou NaN gera 0 ticks", () => {
    expect(advanceClock(createClock(), -50).ticks).toBe(0);
    expect(advanceClock(createClock(), NaN).ticks).toBe(0);
  });
});
