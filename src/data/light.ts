import { PALETTE } from "./palette";

export const LIGHT = {
  radiusTiles: 4,
  intensity: 2,
  ambientColor: PALETTE.noite,
  color: PALETTE.luz,
  // Lanterna do celular (biblia 5.4 e 4.1)
  durationSeconds: 150,
  offRadiusTiles: 1.5,
  toggleCooldownSeconds: 0.5,
} as const;
