// Constants
const BOARD_SIZE = 9;
const DELAY_BETWEEN_GAMES = 2000;

// Modal to ask for the user's name
const modal = document.getElementById('user-name-modal');
const nameInput = document.getElementById('user-name');
const submitNameBtn = document.getElementById('submit-name');
let playerName = '';
let consecutiveWins = 0;
let maxConsecutiveWins = localStorage.getItem('maxWins') || 0;
let leaderName = localStorage.getItem('leaderName') || 'No leader yet!';
document.getElementById('leaderboard-user').textContent = leaderName;

// Show the modal on page load
modal.style.display = 'block';

submitNameBtn.addEventListener('click', () => {
  playerName = nameInput.value.trim();
  if (playerName) {
    modal.style.display = 'none';
    startGame();
  }
});

let gameBoard;
let activePlayer;
let gameActive;
let board;
let difficulty = 'medium'; // Default difficulty level

// Event listeners for difficulty buttons
document.getElementById('easy').addEventListener('click', () => difficulty = 'easy');
document.getElementById('medium').addEventListener('click', () => difficulty = 'medium');
document.getElementById('hard').addEventListener('click', () => difficulty = 'hard');

function startGame() {
  gameBoard = Array(BOARD_SIZE).fill(null);
  activePlayer = 'X';
  gameActive = true;

  board = document.getElementById('tic-tac-toe-board');
  board.innerHTML = '';

  gameBoard.forEach((_, i) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');  // Assuming you have CSS for the cell
    cell.addEventListener('click', () => makeMove(i, cell), { once: true });
    board.appendChild(cell);
  });

  document.getElementById('win-status').textContent = ''; // Clear status
}

function makeMove(index, cell) {
  if (!gameActive) return;

  gameBoard[index] = activePlayer;
  cell.textContent = activePlayer;

  if (checkWinner()) {
    document.getElementById('win-status').textContent = `${playerName} wins!`;
    if (activePlayer === 'X') {
      consecutiveWins++;
      updateLeaderboard();
    } else {
       document.getElementById('win-status').textContent = 'HOW CAN YOU FUCKING LOSE TO A STUPID MACHINE YOU DUMBFUCK!!!!!';
      consecutiveWins = 0;
    }
    gameActive = false;
    setTimeout(startGame, DELAY_BETWEEN_GAMES);
  } else if (gameBoard.every(Boolean)) {
    document.getElementById('win-status').textContent = 'Draw!';
    consecutiveWins = 0;
    gameActive = false;
    setTimeout(startGame, DELAY_BETWEEN_GAMES);
  } else {
    activePlayer = activePlayer === 'X' ? 'O' : 'X';
    if (activePlayer === 'O') {
      setTimeout(makeAIMove, 500);
    }
  }
}

function makeAIMove() {
  let bestMove;
  
  if (difficulty === 'easy') {
    bestMove = makeRandomMove();
  } else if (difficulty === 'medium') {
    if (Math.random() > 0.5) {
      bestMove = makeRandomMove(); // 50% chance to play randomly
    } else {
      bestMove = findBestMove();
    }
  } else {
    bestMove = findBestMove(); // Hard difficulty - always use Minimax
  }

  makeMove(bestMove, board.children[bestMove]);
}

function makeRandomMove() {
  const availableMoves = gameBoard
    .map((val, index) => val === null ? index : null)
    .filter(val => val !== null);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function findBestMove() {
  let bestMove = -1;
  let bestScore = -Infinity;
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (gameBoard[i] === null) {
      gameBoard[i] = 'O';
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWinner()) {
    if (boardState.includes('X')) {
      return -10 + depth;
    } else if (boardState.includes('O')) {
      return 10 - depth;
    } else {
      return 0;
    }
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (boardState[i] === null) {
        boardState[i] = 'O';
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (boardState[i] === null) {
        boardState[i] = 'X';
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winningCombinations.some(combination =>
    combination.every(index => gameBoard[index] === activePlayer)
  );
}

function updateLeaderboard() {
  if (consecutiveWins > maxConsecutiveWins) {
    maxConsecutiveWins = consecutiveWins;
    localStorage.setItem('maxWins', maxConsecutiveWins);
    localStorage.setItem('leaderName', playerName);
    document.getElementById('leaderboard-user').textContent = playerName;
    console.log(`New record! ${maxConsecutiveWins} consecutive wins by ${playerName}`);
  }
}
