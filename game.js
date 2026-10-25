/* =============================================
   TICTACTOE – 2 PLAYER  |  game.js
   ============================================= */

// ── DOM references ──────────────────────────
const screens = {
  setup:       document.getElementById('setup-screen'),
  game:        document.getElementById('game-screen'),
  leaderboard: document.getElementById('leaderboard-screen'),
};

const els = {
  p1Input:     document.getElementById('player1-name'),
  p2Input:     document.getElementById('player2-name'),
  startBtn:    document.getElementById('start-btn'),
  viewLbBtn:   document.getElementById('view-lb-btn'),

  nameP1:      document.getElementById('name-p1'),
  nameP2:      document.getElementById('name-p2'),
  ptsP1:       document.getElementById('pts-p1'),
  ptsP2:       document.getElementById('pts-p2'),
  ptsDraw:     document.getElementById('pts-draw'),
  scoreP1Box:  document.getElementById('score-p1'),
  scoreP2Box:  document.getElementById('score-p2'),

  statusBanner:document.getElementById('status-banner'),
  statusText:  document.getElementById('status-text'),
  board:       document.getElementById('board'),
  cells:       document.querySelectorAll('.cell'),

  restartBtn:  document.getElementById('restart-btn'),
  newGameBtn:  document.getElementById('new-game-btn'),
  lbBtn:       document.getElementById('leaderboard-btn'),

  winOverlay:  document.getElementById('win-overlay'),
  winIcon:     document.getElementById('win-icon'),
  winTitle:    document.getElementById('win-title'),
  winSubtitle: document.getElementById('win-subtitle'),
  overlayAgain:  document.getElementById('overlay-again'),
  overlayChange: document.getElementById('overlay-change'),

  lbBody:      document.getElementById('lb-body'),
  backFromLb:  document.getElementById('back-from-lb'),
  clearLbBtn:  document.getElementById('clear-lb-btn'),
};

// ── Winning combinations ────────────────────
const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],         // diagonals
];

// ── Game state ──────────────────────────────
let state = {
  board:       Array(9).fill(null),   // null | 'X' | 'O'
  current:     'X',                   // whose turn
  gameOver:    false,
  players:     { X: 'Pemain 1', O: 'Pemain 2' },
  session:     { X: 0, O: 0, draw: 0 }, // scores this session
};

// ── LocalStorage helpers ────────────────────
const LS_KEY = 'ttt_leaderboard_v2';

function loadLeaderboard() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}

function saveLeaderboard(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

/**
 * Upsert a player result into the leaderboard.
 * Each entry: { name, wins, games }
 */
function recordResult(name, won) {
  const lb = loadLeaderboard();
  const key = name.trim().toLowerCase();
  let entry = lb.find(e => e.key === key);
  if (!entry) {
    entry = { key, name: name.trim(), wins: 0, games: 0 };
    lb.push(entry);
  }
  entry.games += 1;
  if (won) entry.wins += 1;
  saveLeaderboard(lb);
}

// ── Screen routing ───────────────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── Start / setup ─────────────────────────────
els.startBtn.addEventListener('click', () => {
  const p1 = els.p1Input.value.trim() || 'Pemain 1';
  const p2 = els.p2Input.value.trim() || 'Pemain 2';
  state.players = { X: p1, O: p2 };
  state.session = { X: 0, O: 0, draw: 0 };
  els.nameP1.textContent = p1;
  els.nameP2.textContent = p2;
  updateScoreDisplay();
  resetBoard();
  showScreen('game');
});

els.viewLbBtn.addEventListener('click', () => {
  renderLeaderboard();
  // remember we came from setup
  els.backFromLb.dataset.from = 'setup';
  showScreen('leaderboard');
});

// ── Board interactions ────────────────────────
els.cells.forEach(cell => {
  cell.addEventListener('click', () => handleCellClick(cell));
});

function handleCellClick(cell) {
  const idx = parseInt(cell.dataset.index);
  if (state.gameOver || state.board[idx]) return;

  // Place mark
  state.board[idx] = state.current;
  renderMark(cell, state.current);
  cell.classList.add('taken');

  // Check result
  const winCombo = getWinCombo();
  if (winCombo) {
    highlightWinners(winCombo);
    endGame('win');
  } else if (state.board.every(Boolean)) {
    endGame('draw');
  } else {
    switchTurn();
  }
}

function renderMark(cell, mark) {
  cell.classList.add(mark.toLowerCase());
  const span = document.createElement('span');
  span.className = 'mark';
  span.textContent = mark === 'X' ? '✕' : '○';
  cell.appendChild(span);
}

function getWinCombo() {
  return WIN_COMBOS.find(([a, b, c]) =>
    state.board[a] &&
    state.board[a] === state.board[b] &&
    state.board[a] === state.board[c]
  ) || null;
}

function highlightWinners(combo) {
  combo.forEach(i => els.cells[i].classList.add('winner'));
}

function switchTurn() {
  state.current = state.current === 'X' ? 'O' : 'X';
  updateStatusBanner();
  updateActiveTurnHighlight();
}

// ── Game end ───────────────────────────────────
function endGame(result) {
  state.gameOver = true;
  els.winOverlay.classList.remove('hidden');

  if (result === 'win') {
    const winner = state.players[state.current];
    const loser  = state.players[state.current === 'X' ? 'O' : 'X'];
    state.session[state.current] += 1;

    // Record into leaderboard
    recordResult(winner, true);
    recordResult(loser, false);

    els.winIcon.textContent = state.current === 'X' ? '🔴' : '🔵';
    els.winTitle.textContent = `${winner} Menang!`;
    els.winSubtitle.textContent = 'Selamat atas kemenangan ini!';
    setStatusBanner(`${winner} Menang! 🎉`, 'win');
  } else {
    state.session.draw += 1;
    // Record as played (no win) for both
    recordResult(state.players.X, false);
    recordResult(state.players.O, false);

    els.winIcon.textContent = '🤝';
    els.winTitle.textContent = 'Seri!';
    els.winSubtitle.textContent = 'Pertandingan berakhir imbang.';
    setStatusBanner('Seri! 🤝', 'draw');
  }

  updateScoreDisplay();

  // Auto-close overlay after 2.5s (optional — user can click buttons instead)
  // setTimeout(() => els.winOverlay.classList.add('hidden'), 2500);
}

// ── Reset ─────────────────────────────────────
function resetBoard() {
  state.board = Array(9).fill(null);
  state.current = 'X';
  state.gameOver = false;

  els.cells.forEach(cell => {
    cell.className = 'cell';
    cell.innerHTML = '';
  });

  updateStatusBanner();
  updateActiveTurnHighlight();
  els.winOverlay.classList.add('hidden');
}

els.restartBtn.addEventListener('click', resetBoard);
els.overlayAgain.addEventListener('click', resetBoard);

els.newGameBtn.addEventListener('click', goToSetup);
els.overlayChange.addEventListener('click', goToSetup);

function goToSetup() {
  els.winOverlay.classList.add('hidden');
  showScreen('setup');
}

// ── Status banner helpers ─────────────────────
function updateStatusBanner() {
  const name = state.players[state.current];
  const cls  = state.current === 'X' ? 'turn-x' : 'turn-o';
  const mark = state.current === 'X' ? '✕' : '○';
  setStatusBanner(`Giliran ${name} (${mark})`, cls);
}

function setStatusBanner(text, cls) {
  els.statusBanner.className = `status-banner ${cls || ''}`;
  els.statusText.textContent = text;
}

function updateActiveTurnHighlight() {
  els.scoreP1Box.classList.toggle('active-turn', state.current === 'X');
  els.scoreP2Box.classList.toggle('active-turn', state.current === 'O');
}

// ── Score display ─────────────────────────────
function updateScoreDisplay() {
  els.ptsP1.textContent   = state.session.X;
  els.ptsP2.textContent   = state.session.O;
  els.ptsDraw.textContent = state.session.draw;
}

// ── Leaderboard ───────────────────────────────
els.lbBtn.addEventListener('click', () => {
  renderLeaderboard();
  els.backFromLb.dataset.from = 'game';
  showScreen('leaderboard');
});

els.backFromLb.addEventListener('click', () => {
  const from = els.backFromLb.dataset.from || 'setup';
  showScreen(from);
});

els.clearLbBtn.addEventListener('click', () => {
  if (confirm('Hapus semua data leaderboard? Tindakan ini tidak bisa dibatalkan.')) {
    saveLeaderboard([]);
    renderLeaderboard();
  }
});

function renderLeaderboard() {
  const lb = loadLeaderboard()
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      const pctA = a.games ? a.wins / a.games : 0;
      const pctB = b.games ? b.wins / b.games : 0;
      return pctB - pctA;
    })
    .slice(0, 10);

  if (!lb.length) {
    els.lbBody.innerHTML = '<tr class="lb-empty"><td colspan="5">Belum ada data permainan</td></tr>';
    return;
  }

  els.lbBody.innerHTML = lb.map((entry, i) => {
    const rank = i + 1;
    const pct  = entry.games ? Math.round((entry.wins / entry.games) * 100) : 0;
    const pctClass = pct >= 60 ? 'pct-high' : pct >= 40 ? 'pct-mid' : 'pct-low';
    const rankMedal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    const rankClass = rank <= 3 ? `rank-${rank}` : '';

    return `<tr>
      <td class="${rankClass}">${rankMedal}</td>
      <td>${escapeHtml(entry.name)}</td>
      <td>${entry.wins}</td>
      <td>${entry.games}</td>
      <td class="win-pct ${pctClass}">${pct}%</td>
    </tr>`;
  }).join('');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ──────────────────────────────────────
showScreen('setup');
updateStatusBanner();
updateActiveTurnHighlight();
