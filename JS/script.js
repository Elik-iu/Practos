// Получаем элементы DOM
const gameCells = document.querySelectorAll('.game-cell');
const gameMessage = document.getElementById('game-message');
const restartButton = document.getElementById('restart-button');
const modeToggle = document.getElementById('mode-toggle');

// Начальное состояние игры
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let playerTurn = "X";
let gameIsActive = true;
let isSinglePlayer = true; // По умолчанию игра против бота

// Функция для проверки победителя
function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Строки
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Столбцы
        [0, 4, 8], [2, 4, 6]             // Диагонали
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameIsActive = false;
            return gameBoard[a];
        }
    }

    if (!gameBoard.includes("")) {
        gameIsActive = false;
        return "Ничья!";
    }

    return null;
}

// Функция для отображения сообщения
function displayGameMessage(message) {
    gameMessage.textContent = message;
}

// Обработчик клика на ячейку
function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.dataset.position);

    if (gameBoard[cellIndex] !== "" || !gameIsActive) {
        return; // Ячейка занята или игра закончена
    }

    gameBoard[cellIndex] = playerTurn;
    clickedCell.textContent = playerTurn;

    let winResult = checkWinner();

    if (winResult) {
        displayGameMessage(winResult === "Ничья!" ? "Ничья!" : `Победитель: ${winResult}`);
        return;
    }

    // Переключаем ход
    playerTurn = playerTurn === "X" ? "O" : "X";
    
    if (isSinglePlayer && playerTurn === "O") {
        setTimeout(botMove, 500);
    } else {
        displayGameMessage(`Ход игрока: ${playerTurn}`);
    }
}

// Функция хода бота
function botMove() {
    if (!gameIsActive) return;

    let availableSpots = [];
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === "") {
            availableSpots.push(i);
        }
    }

    if (availableSpots.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSpots.length);
        const botChoice = availableSpots[randomIndex];

        gameBoard[botChoice] = playerTurn;
        document.querySelector(`[data-position="${botChoice}"]`).textContent = playerTurn;

        let winResult = checkWinner();

        if (winResult) {
            displayGameMessage(winResult === "Ничья!" ? "Ничья!" : `Победитель: ${winResult}`);
            return;
        }

        playerTurn = "X"; // Возвращаем ход игроку
        displayGameMessage(`Ход игрока: ${playerTurn}`);
    }
}

// Функция для сброса игры
function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    playerTurn = "X";
    gameIsActive = true;

    gameCells.forEach(cell => cell.textContent = "");
    displayGameMessage(isSinglePlayer ? "Ход игрока: X" : "Ход игрока: X");
}

// Функция переключения режима игры
function toggleGameMode() {
    isSinglePlayer = !isSinglePlayer;
    resetGame();
    modeToggle.textContent = isSinglePlayer ? "Режим: Игрок vs Бот" : "Режим: Игрок vs Игрок";
}

// Добавляем обработчики событий
gameCells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', resetGame);
modeToggle.addEventListener('click', toggleGameMode);

// Инициализация игры
resetGame();