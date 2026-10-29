import { ENZO_COMBAT, SWING_EPSILON, WEAPONS } from "../data/combat";
import { SIM } from "../data/sim";
import { WORLD } from "../data/world";
import { isDodging } from "./dodge";
import type { Command, GameState } from "./types";

type Weapon = { readonly reachTiles: number; readonly arcDegrees: number };
type Point = { readonly x: number; readonly y: number };

export function secondsToTicks(s: number): number {
  return Math.round(s * SIM.ticksPerSecond);
}

// dir deve estar normalizado. Distancia 0 conta como acerto.
export function inSwing(origin: Point, dir: Point, target: Point, weapon: Weapon): boolean {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const dist = Math.hypot(dx, dy);
  if (dist > weapon.reachTiles * WORLD.tilePx + SWING_EPSILON) return false;
  if (dist === 0) return true;
  const cos = Math.min(1, Math.max(-1, (dx * dir.x + dy * dir.y) / dist));
  const angle = (Math.acos(cos) * 180) / Math.PI;
  return angle <= weapon.arcDegrees / 2 + SWING_EPSILON;
}

export function trySwing(state: GameState, command: Command): GameState {
  const p = state.player;
  if (command.attack !== true || p.fainted || p.attackCooldownTicks > 0) return state;
  const w = WEAPONS.galho;
  const ax = command.aimX ?? 0;
  const ay = command.aimY ?? 0;
  const len = Math.hypot(ax, ay);
  const dir = len > 0 ? { x: ax / len, y: ay / len } : { x: p.facingX, y: p.facingY };
  const dummies = state.dummies
    .map((d) => (inSwing(p, dir, d, w) ? { ...d, hp: d.hp - w.damage } : d))
    .filter((d) => d.hp > 0);
  return {
    ...state,
    dummies,
    lastSwing: { tick: state.tick, dirX: dir.x, dirY: dir.y },
    player: {
      ...p,
      facingX: dir.x,
      facingY: dir.y,
      attackCooldownTicks: secondsToTicks(w.intervalSeconds),
    },
  };
}

// Meio de teste do dano ao Enzo (nenhum inimigo chama isso ainda). Esquiva e invulnerabilidade ignoram o dano.
export function damagePlayer(state: GameState, amount: number): GameState {
  const p = state.player;
  if (isDodging(state) || p.invulnerableTicks > 0 || p.fainted) return state;
  const hp = Math.max(0, p.hp - amount);
  return {
    ...state,
    player: { ...p, hp, invulnerableTicks: secondsToTicks(ENZO_COMBAT.invulnerableSeconds), fainted: hp === 0 },
  };
}
