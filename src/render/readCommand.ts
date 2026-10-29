import type { Command } from "../sim";

export type Keys = {
  readonly left: boolean;
  readonly right: boolean;
  readonly up: boolean;
  readonly down: boolean;
  readonly toggleLight: boolean;
};

export function readCommand(keys: Keys): Command {
  const moveX = (Number(keys.right) - Number(keys.left)) as -1 | 0 | 1;
  const moveY = (Number(keys.down) - Number(keys.up)) as -1 | 0 | 1;
  return { moveX, moveY, toggleLight: keys.toggleLight };
}
