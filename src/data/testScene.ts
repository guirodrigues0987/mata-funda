import { PALETTE } from "./palette";

// Cenario provisorio: formas escuras. x,y = CENTRO, em px relativos ao centro da tela (mesma origem do player).
export const TEST_SCENE = {
  colors: [PALETTE.folhaClara, PALETTE.folhagem, PALETTE.osso],
  shapes: [
    { id: "a", x: 150, y: -80, width: 70, height: 70 },
    { id: "b", x: -120, y: 140, width: 90, height: 50 },
    { id: "c", x: 340, y: 40, width: 80, height: 80 },
    { id: "d", x: -450, y: -60, width: 100, height: 70 },
    { id: "e", x: 600, y: -120, width: 90, height: 90 },
    { id: "f", x: 80, y: 420, width: 120, height: 60 },
  ],
} as const;
