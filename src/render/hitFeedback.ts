import { COMBAT_VIEW, TRAINING_DUMMY } from "../data/combat";
import { secondsToTicks } from "../sim/combat";
import type { GameState } from "../sim/types";

export type HitFeedbackView = {
  // id do alvo que deve piscar agora (ou null)
  readonly flashTargetId: string | null;
  // numero de dano a mostrar (progress 0..1 do tempo de exibicao) ou null
  readonly damageText: { readonly text: string; readonly x: number; readonly y: number; readonly progress: number } | null;
  readonly hp: readonly { readonly id: string; readonly x: number; readonly y: number; readonly cur: number; readonly max: number }[];
};

// Funcao pura: so le o estado. O desenho em Phaser usa o resultado.
export function hitFeedbackView(st: GameState): HitFeedbackView {
  const h = st.lastHit;
  const age = h === null ? Infinity : st.tick - h.tick;
  const flashing = h !== null && age <= secondsToTicks(COMBAT_VIEW.hitFlashSeconds);
  const flashTargetId = flashing && st.dummies.some((d) => d.id === h.targetId) ? h.targetId : null;
  const textTicks = secondsToTicks(COMBAT_VIEW.damageTextSeconds);
  const damageText =
    h !== null && age <= textTicks
      ? { text: String(h.damage), x: h.x, y: h.y, progress: textTicks === 0 ? 1 : age / textTicks }
      : null;
  const hp = st.dummies.map((d) => ({ id: d.id, x: d.x, y: d.y, cur: d.hp, max: TRAINING_DUMMY.hp }));
  return { flashTargetId, damageText, hp };
}
