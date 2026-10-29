// Clique pendente: so e consumido quando o quadro roda ao menos um tick da simulacao.
// Quadros sem tick (monitor de alta taxa, jitter) mantem o clique para o proximo quadro.
export function consumeClick(pending: boolean, ticks: number): { readonly pulse: boolean; readonly pending: boolean } {
  if (ticks > 0) return { pulse: pending, pending: false };
  return { pulse: false, pending };
}
