import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PALETTE } from "../src/data/palette";
import { RENDER } from "../src/data/render";

describe("arquitetura", () => {
  it("src/sim nao importa phaser nem render", () => {
    const dir = join(__dirname, "../src/sim");
    const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const imports = readFileSync(join(dir, f), "utf8")
        .split("\n")
        .filter((l) => /^\s*(import|export)\b.*from/.test(l));
      for (const l of imports) {
        expect(l).not.toMatch(/phaser/);
        expect(l).not.toMatch(/render\//);
      }
    }
  });
  it("dados base", () => {
    expect(PALETTE.noite).toBe("#0b0f0c");
    expect(RENDER.baseWidth).toBe(1920);
    expect(RENDER.baseHeight).toBe(1080);
  });
});
