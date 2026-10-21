#!/bin/bash
# Roda uma rodada do Scrum Master em modo não interativo.
# Uso no cron (a cada 60 min, sem sobrepor rodadas):
#   0 * * * * flock -n /tmp/mata-funda-rodada.lock /home/agentes/mata-funda/scripts/rodada.sh

export PATH="$HOME/.npm-global/bin:$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$REPO/logs/rodadas.log"
mkdir -p "$REPO/logs"
cd "$REPO" || exit 1

echo "" >> "$LOG"
echo "=== Rodada $(date '+%Y-%m-%d %H:%M') ===" >> "$LOG"

git checkout main >> "$LOG" 2>&1
git pull --rebase >> "$LOG" 2>&1 || { echo "git pull falhou, rodada cancelada" >> "$LOG"; exit 1; }

claude -p "Execute uma rodada do quadro conforme o CLAUDE.md. Ao final, mostre o resumo da rodada." >> "$LOG" 2>&1

git push >> "$LOG" 2>&1
echo "=== Fim $(date '+%H:%M') ===" >> "$LOG"
