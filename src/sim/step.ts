import { PLAYER } from "../data/player";
import { SIM } from "../data/sim";
import { TEST_MAP } from "../data/testMap";
import { WORLD } from "../data/world";
import { moveWithCollision } from "./collision";
import type { TileGrid } from "./collision";
import { advanceDodge, createDodgeState, DODGE_SPEED_PX, startDodge } from "./dodge";
import { createLightState, stepLight } from "./light";
import { moveVector } from "./movement";
import type { Command, GameState } from "./types";

export type SpawnMap = TileGrid & { readonly spawn: { readonly col: number; readonly row: number } };

export function createInitialState(map: SpawnMap = TEST_MAP): GameState {
  return {
    tick: 0,
    light: createLightState(),
    player: {
      x: (map.spawn.col + 0.5) * WORLD.tilePx,
      y: (map.spawn.row + 0.5) * WORLD.tilePx,
      hp: PLAYER.maxHp,
      dodge: createDodgeState(),
    },
  };
}

export function step(state: GameState, command: Command, map: TileGrid = TEST_MAP): GameState {
  const walkSpeed = (PLAYER.speedTilesPerSecond * WORLD.tilePx) / SIM.ticksPerSecond;
  const started = startDodge(state.player.dodge, command);
  const rolling = started.ticksLeft > 0;
  const v = rolling ? { x: started.dirX, y: started.dirY } : moveVector(command);
  const d = rolling ? DODGE_SPEED_PX : walkSpeed;
  const moved = moveWithCollision(
    map,
    state.player,
    v.x * d,
    v.y * d,
    PLAYER.halfWidthTiles * WORLD.tilePx,
    PLAYER.halfHeightTiles * WORLD.tilePx,
  );
  return {
    tick: state.tick + 1,
    light: stepLight(state.light, command.toggleLight === true),
    player: { ...state.player, x: moved.x, y: moved.y, dodge: advanceDodge(started) },
  };
}

export function run(state: GameState, commands: readonly Command[], map: TileGrid = TEST_MAP): GameState {
  let s = state;
  for (const c of commands) s = step(s, c, map);
  return s;
}
