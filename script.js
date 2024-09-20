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

function startGame() {
  const board = document.getElementById('tic-tac-toe-board');
  let currentPlayer = 'X';
  let boardState = Array(9).fill(null);
  let gameActive = true;
  
  board.innerHTML = '';
  boardState.forEach((_, i) => {
    const cell = document.createElement('div');
    cell.addEventListener('click', () => makeMove(i, cell), { once: true });
    board.appendChild(cell);
  });

  function makeMove(i, cell) {
    if (!gameActive) return;
    
    boardState[i] = currentPlayer;
    cell.textContent = currentPlayer;
    
    if (checkWinner()) {
      document.getElementById('win-status').textContent = `${currentPlayer} wins!`;
      if (currentPlayer === 'X') {
        consecutiveWins++;
        updateLeaderboard();
      } else {
        consecutiveWins = 0;
      }
      gameActive = false;
      setTimeout(startGame, 2000);
    } else if (boardState.every(Boolean)) {
      document.getElementById('win-status').textContent = 'Draw!';
      consecutiveWins = 0;
      gameActive = false;
      setTimeout(startGame, 2000);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }
  
  function checkWinner() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return winningCombinations.some(combination => 
      combination.every(index => boardState[index] === currentPlayer)
    );
  }
}

function updateLeaderboard() {
  if (consecutiveWins > maxConsecutiveWins) {
    maxConsecutiveWins = consecutiveWins;
    localStorage.setItem('maxWins', maxConsecutiveWins);
    localStorage.setItem('leaderName', playerName);
    document.getElementById('leaderboard-user').textContent = playerName;
  }
}

// Load leaderboard on page load
window.onload = () => {
  document.getElementById('leaderboard-user').textContent = localStorage.getItem('leaderName') || 'No leader yet!';
};
