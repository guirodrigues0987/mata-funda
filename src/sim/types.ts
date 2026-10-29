export type Command = {
  readonly moveX: -1 | 0 | 1;
  readonly moveY: -1 | 0 | 1;
  readonly toggleLight?: boolean;
  readonly dodge?: boolean;
  // true so no tick em que houve clique; aim = vetor do Enzo ate o mouse (px)
  readonly attack?: boolean;
  readonly aimX?: number;
  readonly aimY?: number;
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
    readonly facingX: number;
    readonly facingY: number;
    readonly attackCooldownTicks: number;
    readonly invulnerableTicks: number;
    readonly fainted: boolean;
  };
  readonly light: LightState;
  readonly dummies: readonly Dummy[];
  // So para o render desenhar o golpe
  readonly lastSwing: { readonly tick: number; readonly dirX: number; readonly dirY: number } | null;
};

export type Dummy = { readonly id: string; readonly x: number; readonly y: number; readonly hp: number };
