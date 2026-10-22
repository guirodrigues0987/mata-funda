import { LIGHT } from "../data/light";
import { WORLD } from "../data/world";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function lightRadiusPx(): number {
  return LIGHT.radiusTiles * WORLD.tilePx;
}

// x,y = centro da forma. True se o ponto do retangulo mais proximo da origem esta a distancia <= raio.
export function isLit(origin: { x: number; y: number }, shape: Rect, radiusPx: number): boolean {
  const hw = shape.width / 2;
  const hh = shape.height / 2;
  const cx = Math.min(Math.max(origin.x, shape.x - hw), shape.x + hw);
  const cy = Math.min(Math.max(origin.y, shape.y - hh), shape.y + hh);
  return Math.hypot(cx - origin.x, cy - origin.y) <= radiusPx;
}
