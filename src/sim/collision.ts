import { SIM } from "../data/sim";
import { WORLD } from "../data/world";

export type TileGrid = { readonly rows: readonly string[] };

export function isTileBlocked(map: TileGrid, col: number, row: number): boolean {
  if (!Number.isInteger(col) || !Number.isInteger(row)) return true;
  const line = map.rows[row];
  if (line === undefined || col < 0 || col >= line.length) return true;
  return line[col] === "#";
}

export function boxOverlapsBlocked(map: TileGrid, x: number, y: number, halfW: number, halfH: number): boolean {
  const t = WORLD.tilePx;
  const e = SIM.collisionEpsilonPx;
  const c0 = Math.floor((x - halfW + e) / t);
  const c1 = Math.floor((x + halfW - e) / t);
  const r0 = Math.floor((y - halfH + e) / t);
  const r1 = Math.floor((y + halfH - e) / t);
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (isTileBlocked(map, c, r)) return true;
    }
  }
  return false;
}

// Move em eixos separados (X, depois Y): desliza na parede e nunca entra em tile bloqueado.
export function moveWithCollision(
  map: TileGrid,
  pos: { readonly x: number; readonly y: number },
  dx: number,
  dy: number,
  halfW: number,
  halfH: number,
): { x: number; y: number } {
  let x = pos.x;
  let y = pos.y;
  if (dx !== 0 && !boxOverlapsBlocked(map, x + dx, y, halfW, halfH)) x += dx;
  if (dy !== 0 && !boxOverlapsBlocked(map, x, y + dy, halfW, halfH)) y += dy;
  return { x, y };
}
