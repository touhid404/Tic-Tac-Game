// Game state variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "manual"; // Default mode: manual

// Select the game board, status, and reset elements
const gameBoard = document.getElementById("gameBoard");
const status = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
const gameContainer = document.querySelector(".game-container");

// New buttons for selecting game mode
const manualButton = document.getElementById("manualButton");
const autoButton = document.getElementById("autoButton");

// Colors for each player
const playerColors = {
    X: "#2a9d8f", // Light red for Player X
    O: "#b5179e"  // Light blue for Player O
};

const symbolColors = {
    X: "#2a9d8f", // Red for Player X's symbol
    O: "#b5179e"  // Blue for Player O's symbol
};

// Sound effects
const clickSound = new Audio("sounds/click.wav");
const winSound = new Audio("sounds/winSound.wav");

// Function to render the board
function renderBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.textContent = board[i];
        cell.classList.add("cell");
        cell.dataset.index = i;

        // Apply symbol color
        if (board[i]) {
            cell.style.color = symbolColors[board[i]];
        }

        cell.addEventListener("click", () => handleCellClick(i));
        gameBoard.appendChild(cell);
    }
}

// Function to handle a cell click
function handleCellClick(index) {
    if (board[index] !== "" || !gameActive || (gameMode === "auto" && currentPlayer === "O")) return; // Cell already filled, game over, or it's O's turn in auto mode

    board[index] = currentPlayer;
    clickSound.play(); // Play click sound
    renderBoard();
    checkGameStatus();
    togglePlayer();
}

// Function to toggle between players
function togglePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (gameActive) {
        status.textContent = `Player ${currentPlayer}'s turn`;
        gameContainer.style.backgroundColor = playerColors[currentPlayer];
    }

    // In auto mode, automatically make the opponent move after 1-second delay
    if (gameActive && gameMode === "auto" && currentPlayer === "O") {
        setTimeout(() => autoMove(), 1500); // 1-second delay for Player O's move
    }
}

// Function to check the game status (win or draw)
function checkGameStatus() {
    const winPatterns = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal
        [2, 4, 6]  // Diagonal
    ];

    // Check for a winner
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            status.textContent = `Player ${board[a]} wins! 🎉`;
            highlightWinningCells(pattern);
            winSound.play(); // Play winning sound
            return;
        }
    }

    // Check for a draw
    if (!board.includes("")) {
        gameActive = false;
        status.textContent = "It's a draw!";
    }
}

// Function to highlight winning cells
function highlightWinningCells(pattern) {
    pattern.forEach(index => {
        const cell = gameBoard.querySelector(`[data-index="${index}"]`);
        cell.classList.add("winner");
    });
}

// Function to reset the game
resetButton.addEventListener("click", () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    status.textContent = "Player X's turn";
    gameContainer.style.backgroundColor = playerColors[currentPlayer];
    renderBoard();
});

// Function to make an automatic move for player O
function autoMove() {
    // Check if there's a winning move for O
    const winningMove = findWinningMove("O");
    if (winningMove !== -1) {
        board[winningMove] = "O";
        clickSound.play(); // Play click sound
        renderBoard();
        checkGameStatus();
        togglePlayer();
        return; // Exit after making the winning move
    }

    // Check if there's a blocking move for X (to prevent them from winning)
    const blockingMove = findWinningMove("X");
    if (blockingMove !== -1) {
        board[blockingMove] = "O";
        clickSound.play(); // Play click sound
        renderBoard();
        checkGameStatus();
        togglePlayer();
        return; // Exit after blocking Player X's winning move
    }

    // If no winning or blocking move, make a random move
    const emptyCells = board
        .map((cell, index) => (cell === "" ? index : null))
        .filter(index => index !== null);
    
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomCell] = "O";
    clickSound.play(); // Play click sound
    renderBoard();
    checkGameStatus();
    togglePlayer();
}

// Helper function to find a winning move for a player
function findWinningMove(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const cells = [board[a], board[b], board[c]];

        // Check if two cells are occupied by the same player and the third is empty
        if (cells.filter(cell => cell === player).length === 2 && cells.includes("")) {
            // Return the index of the empty cell to complete the winning move
            return [a, b, c].find(index => board[index] === "");
        }
    }

    return -1; // No winning move found
}

// Initialize the game
gameContainer.style.backgroundColor = playerColors[currentPlayer]; // Initial background color
renderBoard();

// Game mode selection
manualButton.addEventListener("click", () => {
    if (gameMode !== "manual") {
        gameMode = "manual";
        status.textContent = "Manual mode: Player X's turn";
        gameActive = true;
        renderBoard();

        // Update the game mode display
        document.getElementById("modeDisplay").textContent = "Manual";

        // Fix the button color to indicate it was selected
        manualButton.style.backgroundColor = "#f4a261";  // Change color for manual mode
        autoButton.style.backgroundColor = "#457b9d";  // Reset auto button color
    }
});

autoButton.addEventListener("click", () => {
    if (gameMode !== "auto") {
        gameMode = "auto";
        status.textContent = "Auto mode: Player X's turn";
        gameActive = true;
        renderBoard();

        // Update the game mode display
        document.getElementById("modeDisplay").textContent = "Auto";

        // Fix the button color to indicate it was selected
        autoButton.style.backgroundColor = "#f4a261";  // Change color for auto mode
        manualButton.style.backgroundColor = "#457b9d";  // Reset manual button color
    }
});

// Get modal and buttons
const infoModal = document.getElementById("infoModal");
const infoButton = document.getElementById("infoButton");
const closeButton = document.getElementById("closeButton");

// Show modal when "infoButton" is clicked
infoButton.onclick = function() {
    infoModal.style.display = "block";
}

// Close modal when the close button is clicked
closeButton.onclick = function() {
    infoModal.style.display = "none";
}

// Close modal if the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target === infoModal) {
        infoModal.style.display = "none";
    }
}
