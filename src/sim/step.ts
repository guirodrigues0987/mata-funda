import { PLAYER } from "../data/player";
import { SIM } from "../data/sim";
import { WORLD } from "../data/world";
import { moveVector } from "./movement";
import type { Command, GameState } from "./types";

export function createInitialState(): GameState {
  return { tick: 0, player: { x: PLAYER.startX, y: PLAYER.startY } };
}

export function step(state: GameState, command: Command): GameState {
  const d = (PLAYER.speedTilesPerSecond * WORLD.tilePx) / SIM.ticksPerSecond;
  const v = moveVector(command);
  return {
    tick: state.tick + 1,
    player: {
      x: state.player.x + v.x * d,
      y: state.player.y + v.y * d,
    },
  };
}

export function run(state: GameState, commands: readonly Command[]): GameState {
  let s = state;
  for (const c of commands) s = step(s, c);
  return s;
}
