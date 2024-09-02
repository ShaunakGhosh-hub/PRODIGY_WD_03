// script.js

// Select all the cells, the status display, and the reset button
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X'; // Track the current player
let gameActive = true; // Flag to check if the game is active

// Add click event listeners to all cells
cells.forEach(cell => {
    cell.addEventListener('click', function() {
        // If the cell already has a marker or the game is not active, do nothing
        if (cell.textContent || !gameActive) return;

        cell.textContent = currentPlayer; // Mark the cell with the current player's marker

        if (checkWin()) { // Check if the current player has won
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false; // End the game
            return;
        }

        if (Array.from(cells).every(cell => cell.textContent)) { // Check for a draw
            status.textContent = "It's a draw!";
            gameActive = false; // End the game
            return;
        }

        // Switch to the other player
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    });
});

// Add click event listener to the reset button
resetButton.addEventListener('click', function() {
    cells.forEach(cell => cell.textContent = ''); // Clear all cells
    currentPlayer = 'X'; // Reset to player X
    status.textContent = `Player ${currentPlayer}'s turn`; // Update the status
    gameActive = true; // Activate the game
});

// Function to check for a win
function checkWin() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Check if any winning condition is met
    return winConditions.some(condition => {
        const [a, b, c] = condition;
        return cells[a].textContent &&
               cells[a].textContent === cells[b].textContent &&
               cells[a].textContent === cells[c].textContent;
    });
}
