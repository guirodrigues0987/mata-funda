export const SIM = {
  ticksPerSecond: 60,
  // Teto de ticks por quadro (evita a "espiral da morte" ao voltar de segundo plano).
  maxTicksPerFrame: 10,
  // Folga (px) na comparacao de colisao: encostar exatamente na borda e permitido.
  collisionEpsilonPx: 0.0001,
} as const;
