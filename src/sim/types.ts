export type Command = {
  readonly moveX: -1 | 0 | 1;
  readonly moveY: -1 | 0 | 1;
  readonly toggleLight?: boolean;
  readonly dodge?: boolean;
};

export type LightState = {
  readonly on: boolean;
  readonly chargeTicks: number;
  readonly cooldownTicks: number;
};

export type DodgeState = {
  readonly dirX: number;
  readonly dirY: number;
  // > 0 = rolando
  readonly ticksLeft: number;
  // > 0 = em recarga
  readonly cooldownLeft: number;
};

export type GameState = {
  readonly tick: number;
  readonly player: {
    readonly x: number;
    readonly y: number;
    readonly hp: number;
    readonly dodge: DodgeState;
  };
  readonly light: LightState;
};
