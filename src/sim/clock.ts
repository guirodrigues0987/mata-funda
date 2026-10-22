import { SIM } from "../data/sim";

export type Clock = { readonly accumulatorMs: number };

const EPSILON = 1e-9;

export function createClock(): Clock {
  return { accumulatorMs: 0 };
}

export function advanceClock(
  clock: Clock,
  frameDeltaMs: number,
): { clock: Clock; ticks: number } {
  const delta = Number.isFinite(frameDeltaMs) && frameDeltaMs > 0 ? frameDeltaMs : 0;
  const tickMs = 1000 / SIM.ticksPerSecond;
  const acc = clock.accumulatorMs + delta;
  const due = Math.floor(acc / tickMs + EPSILON);
  const rest = Math.max(0, acc - due * tickMs);
  if (due > SIM.maxTicksPerFrame) {
    // Descarta o excedente; guarda so o resto fracionario.
    return { clock: { accumulatorMs: rest }, ticks: SIM.maxTicksPerFrame };
  }
  return { clock: { accumulatorMs: rest }, ticks: due };
}
