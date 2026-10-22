export function hexToNumber(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}
