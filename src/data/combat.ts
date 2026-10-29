export const WEAPONS = {
  galho: { damage: 2, intervalSeconds: 0.4, reachTiles: 1, arcDegrees: 90 },
} as const;

export const ENZO_COMBAT = { maxHp: 10, invulnerableSeconds: 1 } as const;

// Alvo de treino (valor de teste, nao da biblia). Posicao em px relativa ao ponto de partida do Enzo.
export const TRAINING_DUMMY = { offsetX: 192, offsetY: 0, hp: 6 } as const;

// Tolerancia numerica nas bordas do alcance e do arco.
export const SWING_EPSILON = 1e-6;

// Apresentacao do combate (nao afeta a simulacao).
export const COMBAT_VIEW = {
  dummyColor: 0xaa4444,
  dummyWidthPx: 32,
  dummyHeightPx: 48,
  arcColor: 0xffffff,
  arcLineWidthPx: 6,
  arcShowSeconds: 0.1,
  // TEMPORARIO (playtest): tecla K causa este dano ao Enzo.
  debugKeyDamage: 3,
} as const;
