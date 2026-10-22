import { SIM } from "../data/sim";
import type { Command, GameState } from "./types";

export function createInitialState(): GameState {
  return { tick: 0, player: { x: 0, y: 0 } };
}

export function step(state: GameState, command: Command): GameState {
  const d = SIM.playerSpeedPxPerSecond / SIM.ticksPerSecond;
  return {
    tick: state.tick + 1,
    player: {
      x: state.player.x + command.moveX * d,
      y: state.player.y + command.moveY * d,
    },
  };
}

export function run(state: GameState, commands: readonly Command[]): GameState {
  let s = state;
  for (const c of commands) s = step(s, c);
  return s;
}
