import { LIGHT } from "../data/light";
import { SIM } from "../data/sim";
import { WORLD } from "../data/world";
import type { LightState } from "./types";

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

const MAX_CHARGE_TICKS = LIGHT.durationSeconds * SIM.ticksPerSecond;
const COOLDOWN_TICKS = LIGHT.toggleCooldownSeconds * SIM.ticksPerSecond;

export function createLightState(): LightState {
  return { on: true, chargeTicks: MAX_CHARGE_TICKS, cooldownTicks: 0 };
}

export function stepLight(light: LightState, toggleLight: boolean): LightState {
  let { on, chargeTicks, cooldownTicks } = light;
  if (cooldownTicks > 0) cooldownTicks -= 1;
  if (toggleLight && cooldownTicks === 0 && (on || chargeTicks > 0)) {
    on = !on;
    cooldownTicks = COOLDOWN_TICKS;
  }
  if (on) chargeTicks = Math.max(0, chargeTicks - 1);
  if (chargeTicks === 0) on = false;
  return { on, chargeTicks, cooldownTicks };
}

export function lightRadiusTiles(light: LightState): number {
  return light.on && light.chargeTicks > 0 ? LIGHT.radiusTiles : LIGHT.offRadiusTiles;
}

export function currentLightRadiusPx(light: LightState): number {
  return lightRadiusTiles(light) * WORLD.tilePx;
}

export function batteryPercent(light: LightState): number {
  const pct = Math.ceil((light.chargeTicks / MAX_CHARGE_TICKS) * 100);
  return Math.min(100, Math.max(0, pct));
}
