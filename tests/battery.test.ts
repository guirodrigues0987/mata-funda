import { describe, it, expect } from "vitest";
import { batteryPercent, createInitialState, currentLightRadiusPx, lightRadiusTiles, run } from "../src/sim";
import type { Command, GameState } from "../src/sim";
import { FREE_MAP } from "./freeMap";
import { readCommand } from "../src/render/readCommand";

const idle: Command = { moveX: 0, moveY: 0 };
const press: Command = { moveX: 0, moveY: 0, toggleLight: true };

function seq(n: number, presses: readonly number[] = []): Command[] {
  return Array.from({ length: n }, (_, i) => (presses.includes(i) ? press : idle));
}
function go(n: number, presses: readonly number[] = [], from?: GameState): GameState {
  return run(from ?? createInitialState(FREE_MAP), seq(n, presses), FREE_MAP);
}

describe("bateria da lanterna", () => {
  it("estado inicial: ligada, 100%, raio 4 tiles", () => {
    const s = createInitialState(FREE_MAP);
    expect(s.light.on).toBe(true);
    expect(batteryPercent(s.light)).toBe(100);
    expect(lightRadiusTiles(s.light)).toBe(4);
    expect(currentLightRadiusPx(s.light)).toBe(256);
  });
  it("gasta 150 s (9000 ticks) ligada", () => {
    const s = go(9000);
    expect(s.light.chargeTicks).toBe(0);
    expect(batteryPercent(s.light)).toBe(0);
    expect(s.light.on).toBe(false);
    expect(batteryPercent(go(4500).light)).toBe(50);
    const one = go(1);
    expect(batteryPercent(one.light)).toBe(100);
    expect(one.light.chargeTicks).toBeLessThan(9000);
  });
  it("sem gasto com a luz desligada", () => {
    const off = go(1, [0]);
    expect(off.light.on).toBe(false);
    const later = go(30 + 600, [], off);
    expect(later.light.chargeTicks).toBe(off.light.chargeTicks);
  });
  it("intervalo de 0,5 s entre toques", () => {
    expect(go(30, [0, 29]).light.on).toBe(false);
    expect(go(31, [0, 30]).light.on).toBe(true);
    expect(go(31, [0, 15, 30]).light.on).toBe(true);
    expect(go(30, [0, 15]).light.on).toBe(false);
  });
  it("carga zerada: raio 1,5 tile e L nao acende", () => {
    const empty = go(9000);
    expect(currentLightRadiusPx(empty.light)).toBe(96);
    const after = go(40, [35], go(31, [], empty));
    expect(after.light.on).toBe(false);
    expect(currentLightRadiusPx(after.light)).toBe(96);
  });
  it("luz desligada com carga: raio 96 px", () => {
    expect(currentLightRadiusPx(go(1, [0]).light)).toBe(96);
  });
  it("determinismo", () => {
    const a = go(500, [10, 100, 300]);
    expect(go(500, [10, 100, 300])).toEqual(a);
  });
  it("readCommand repassa toggleLight", () => {
    const k = { left: false, right: false, up: false, down: false };
    expect(readCommand({ ...k, toggleLight: true }).toggleLight).toBe(true);
    expect(readCommand({ ...k, toggleLight: false }).toggleLight).toBe(false);
  });
  it("porcentagem fica em 0..100", () => {
    for (const n of [0, 1, 89, 90, 4500, 8999, 9000]) {
      const p = batteryPercent(go(n).light);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(100);
    }
  });
});
