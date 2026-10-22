import { describe, it, expect } from "vitest";
import { hexToNumber } from "../src/sim";
import { PALETTE } from "../src/data/palette";

describe("hexToNumber", () => {
  it("converte hex literal", () => {
    expect(hexToNumber("#0b0f0c")).toBe(0x0b0f0c);
  });
  it("converte a cor Noite da paleta", () => {
    expect(hexToNumber(PALETTE.noite)).toBe(0x0b0f0c);
  });
});
