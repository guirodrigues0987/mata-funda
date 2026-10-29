import { PLAYER } from "../data/player";
import { SIM } from "../data/sim";
import { TEST_MAP } from "../data/testMap";
import { WORLD } from "../data/world";
import { moveWithCollision } from "./collision";
import type { TileGrid } from "./collision";
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
    },
  };
}

export function step(state: GameState, command: Command, map: TileGrid = TEST_MAP): GameState {
  const d = (PLAYER.speedTilesPerSecond * WORLD.tilePx) / SIM.ticksPerSecond;
  const v = moveVector(command);
  return {
    tick: state.tick + 1,
    light: stepLight(state.light, command.toggleLight === true),
    player: moveWithCollision(
      map,
      state.player,
      v.x * d,
      v.y * d,
      PLAYER.halfWidthTiles * WORLD.tilePx,
      PLAYER.halfHeightTiles * WORLD.tilePx,
    ),
  };
}

export function run(state: GameState, commands: readonly Command[], map: TileGrid = TEST_MAP): GameState {
  let s = state;
  for (const c of commands) s = step(s, c, map);
  return s;
}
