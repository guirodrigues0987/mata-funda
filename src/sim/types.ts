export type Command = {
  readonly moveX: -1 | 0 | 1;
  readonly moveY: -1 | 0 | 1;
  readonly toggleLight?: boolean;
};

export type LightState = {
  readonly on: boolean;
  readonly chargeTicks: number;
  readonly cooldownTicks: number;
};

export type GameState = {
  readonly tick: number;
  readonly player: { readonly x: number; readonly y: number };
  readonly light: LightState;
};
