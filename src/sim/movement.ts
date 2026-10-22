import type { Command } from "./types";

export function moveVector(command: Command): { x: number; y: number } {
  if (command.moveX !== 0 && command.moveY !== 0) {
    return { x: command.moveX * Math.SQRT1_2, y: command.moveY * Math.SQRT1_2 };
  }
  return { x: command.moveX, y: command.moveY };
}
