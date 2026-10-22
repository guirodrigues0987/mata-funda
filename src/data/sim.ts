export const SIM = {
  ticksPerSecond: 60,
  // Teto de ticks por quadro (evita a "espiral da morte" ao voltar de segundo plano).
  maxTicksPerFrame: 10,
} as const;
