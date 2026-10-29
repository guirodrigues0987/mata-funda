import { damagePlayer } from "./combat";
import type { GameState } from "./types";

export type Hazard = { readonly x: number; readonly y: number; readonly radiusPx: number; readonly damage: number };

export function touchHazard(state: GameState, hazard: Hazard): GameState {
  const dist = Math.hypot(state.player.x - hazard.x, state.player.y - hazard.y);
  return dist <= hazard.radiusPx ? damagePlayer(state, hazard.damage) : state;
}
