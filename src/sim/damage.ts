import { isDodging } from "./dodge";
import type { GameState } from "./types";

export type Hazard = { readonly x: number; readonly y: number; readonly radiusPx: number; readonly damage: number };

export function damagePlayer(state: GameState, amount: number): GameState {
  if (isDodging(state)) return state;
  return { ...state, player: { ...state.player, hp: Math.max(0, state.player.hp - amount) } };
}

export function touchHazard(state: GameState, hazard: Hazard): GameState {
  const dist = Math.hypot(state.player.x - hazard.x, state.player.y - hazard.y);
  return dist <= hazard.radiusPx ? damagePlayer(state, hazard.damage) : state;
}
