const board = document.getElementById('board');
const statusText = document.getElementById('status');

let gameState = Array(9).fill("");
let currentPlayer = "X";
let gameActive = false;
let vsAI = false;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

function createBoard() {
  board.innerHTML = "";
  gameState.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", index);
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  });
}

function setMode(mode) {
  vsAI = (mode === 'ai');
  resetGame();
  gameActive = true;
  statusText.textContent = `Player X's turn`;
}

function handleCellClick(e) {
  const index = +e.target.getAttribute("data-index");
  if (gameState[index] || !gameActive || (vsAI && currentPlayer === "O")) return;

  makeMove(index, currentPlayer);
  
  if (checkGameEnd(currentPlayer)) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (vsAI && currentPlayer === "O") {
    setTimeout(() => {
      const aiIndex = findBestMove();
      makeMove(aiIndex, "O");
      if (checkGameEnd("O")) return;
      currentPlayer = "X";
      statusText.textContent = "Player X's turn";
    }, 300);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  const cell = board.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
  cell.classList.add("disabled");
}

function checkGameEnd(player) {
  if (checkWin(player)) {
    statusText.textContent = `${player === "X" ? "Player" : "AI"} ${player} wins!`;
    gameActive = false;
    return true;
  } else if (gameState.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return true;
  }
  return false;
}

function checkWin(player) {
  return winningCombinations.some(([a, b, c]) => 
    gameState[a] === player && gameState[b] === player && gameState[c] === player
  );
}

function resetGame() {
  gameState = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  createBoard();
  statusText.textContent = vsAI ? "Player X's turn" : "Player X's turn";
}

// Minimax Algorithm for unbeatable AI
function findBestMove() {
  let bestScore = -Infinity;
  let move;
  gameState.forEach((cell, index) => {
    if (cell === "") {
      gameState[index] = "O";
      let score = minimax(gameState, 0, false);
      gameState[index] = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  return move;
}

function minimax(state, depth, isMaximizing) {
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return depth - 10;
  if (state.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    state.forEach((cell, i) => {
      if (cell === "") {
        state[i] = "O";
        best = Math.max(best, minimax(state, depth + 1, false));
        state[i] = "";
      }
    });
    return best;
  } else {
    let best = Infinity;
    state.forEach((cell, i) => {
      if (cell === "") {
        state[i] = "X";
        best = Math.min(best, minimax(state, depth + 1, true));
        state[i] = "";
      }
    });
    return best;
  }
}

createBoard();
