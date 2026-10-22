export const SIM = {
  ticksPerSecond: 60,
  // Teto de ticks por quadro (evita a "espiral da morte" ao voltar de segundo plano).
  maxTicksPerFrame: 10,
  // Provisorio: so prova o passo fixo; o card de movimento define o valor final.
  playerSpeedPxPerSecond: 240,
} as const;
