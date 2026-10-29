// Mapa livre grande (so cercado por fora) para testes de movimento em espaco livre.
const N = 40;
export const FREE_MAP = {
  rows: Array.from({ length: N }, (_, r) =>
    Array.from({ length: N }, (_, c) => (r === 0 || c === 0 || r === N - 1 || c === N - 1 ? "#" : ".")).join(""),
  ),
  spawn: { col: 20, row: 20 },
};
