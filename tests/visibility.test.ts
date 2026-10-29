import { describe, it, expect } from "vitest";
import { RENDER } from "../src/data/render";
import { WORLD } from "../src/data/world";
import { TEST_MAP } from "../src/data/testMap";
import { createInitialState, isTileBlocked, lightRadiusPx } from "../src/sim";

describe("visibilidade do alvo de treino", () => {
  const s = createInitialState();
  const d = s.dummies[0];
  it("fica em tile de chao, dentro do alcance da luz", () => {
    const t = WORLD.tilePx;
    expect(isTileBlocked(TEST_MAP, Math.floor(d.x / t), Math.floor(d.y / t))).toBe(false);
    expect(Math.hypot(d.x - s.player.x, d.y - s.player.y)).toBeLessThan(lightRadiusPx());
  });
  it("camadas: combate e Enzo ficam acima do mapa (causa do bug do playtest)", () => {
    expect(RENDER.depth.combat).toBeGreaterThan(RENDER.depth.map);
    expect(RENDER.depth.enzo).toBeGreaterThan(RENDER.depth.combat);
  });
});
