export type Command = {
  readonly moveX: -1 | 0 | 1;
  readonly moveY: -1 | 0 | 1;
};

export type GameState = {
  readonly tick: number;
  readonly player: { readonly x: number; readonly y: number };
};
