import { DODGE } from "../data/dodge";
import { SIM } from "../data/sim";
import { WORLD } from "../data/world";
import { moveVector } from "./movement";
import type { Command, DodgeState, GameState } from "./types";

export const DODGE_TICKS = Math.round(DODGE.durationSeconds * SIM.ticksPerSecond);
export const DODGE_COOLDOWN_TICKS = Math.round(DODGE.cooldownSeconds * SIM.ticksPerSecond);
export const DODGE_SPEED_PX = (DODGE.distanceTiles * WORLD.tilePx) / DODGE_TICKS;

export function createDodgeState(): DodgeState {
  return { dirX: 0, dirY: 0, ticksLeft: 0, cooldownLeft: 0 };
}

export function isDodging(state: GameState): boolean {
  return state.player.dodge.ticksLeft > 0;
}

// Inicia a esquiva se o comando pedir, nao houver recarga e o Enzo estiver se movendo.
export function startDodge(dodge: DodgeState, command: Command): DodgeState {
  if (command.dodge !== true || dodge.ticksLeft > 0 || dodge.cooldownLeft > 0) return dodge;
  const v = moveVector(command);
  if (v.x === 0 && v.y === 0) return dodge;
  return { dirX: v.x, dirY: v.y, ticksLeft: DODGE_TICKS, cooldownLeft: DODGE_COOLDOWN_TICKS };
}

// Consome um tick de rolamento e de recarga.
export function advanceDodge(dodge: DodgeState): DodgeState {
  return {
    ...dodge,
    ticksLeft: Math.max(0, dodge.ticksLeft - 1),
    cooldownLeft: Math.max(0, dodge.cooldownLeft - 1),
  };
}
