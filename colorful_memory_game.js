const colors = ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'yellow', 'cyan', 'magenta', 'lime']
let cards = shuffle(colors.concat(colors)); // Ensure pairs
let selectedCards = [];
let score = 0;
let timeLeft = 60;
let gameInterval;

const startbtn = document.getElementById('startbtn');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

function generateCards() {
    for (const color of cards) {  // similar to python the 'of' keyword allow us to access each the element in the array and assign it the variable color
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.color = color;
        card.textContent = '?';
        card.style.backgroundColor = '#ddd'; // Set default background color
        gameContainer.appendChild(card);
    }
}

function shuffle(array) {  // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // array destructuring, allows you to swap the values of two elements in an array without a temp variable
    }
    return array;
}

function handleCardClick(event) {
    const card = event.target;
    if (!card.classList.contains('card') || card.classList.contains('matched')) {
        return; // ignore further actions, function stops executing
    }
    card.textContent = card.dataset.color;
    card.style.backgroundColor = card.dataset.color;
    selectedCards.push(card);
    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = selectedCards; // destructuring card1 is the first card in the array and card 2 is the second element
    if (card1.dataset.color === card2.dataset.color) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        score += 2;
        scoreElement.textContent = `Score: ${score}`;
    } else {
        card1.textContent = '?';
        card2.textContent = '?';
        card1.style.backgroundColor = '#ddd';
        card2.style.backgroundColor = '#ddd';  // providing a visual cue that the selected cards didn't match.
    }
    selectedCards = []; // we reset the array to select the next 2 cards
    gameWon(); // Check if the game is won
}

function gameWon() {
    const allCards = document.querySelectorAll('.card');
    const allMatched = Array.from(allCards).every(card => card.classList.contains('matched'));
    if (allMatched && timeLeft > 0) {
        clearInterval(gameInterval);
        alert('Game Won!');
        startbtn.disabled = false;
        startbtn.textContent = 'Start'; // Reset button text to "Start"
    }
}

function startGame() {
    startbtn.disabled = true;
    startbtn.textContent = 'Restart'; // Change button text to "Restart"
    score = 0; // Reset score to zero
    scoreElement.textContent = `Score: ${score}`;
    startGameTimer(timeLeft);
    cards = shuffle(colors.concat(colors));
    selectedCards = [];
    gameContainer.innerHTML = ''; // Clears the game container, removing any existing cards from previous games.
    generateCards(); // Generates a new set of cards within the game container by calling the 'generateCards()' function, creating a fresh game layout for the player.
    gameContainer.addEventListener('click', handleCardClick); // manage the gameplay when cards are clicked.
}


function restartGame() {
    clearInterval(gameInterval);
    timeLeft = 60;
    cards = shuffle(colors.concat(colors)); // Shuffle the cards again
    selectedCards = [];
    gameContainer.innerHTML = ''; // Clear the existing cards
    generateCards(); // Generate new cards
    startGameTimer(timeLeft); // Start the game timer
    score = 0; // Reset score to zero
    scoreElement.textContent = `Score: ${score}`;
    startbtn.disabled = true;
    startbtn.textContent = 'Restart'; // Change button text to "Restart"
}

function startGameTimer(timeLeft) {
    timerElement.textContent = `Time Left: ${timeLeft}`;
    gameInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}`;
        if (timeLeft === 0) {
            clearInterval(gameInterval);
            alert('Game Over!');
            startbtn.disabled = false;
            startbtn.textContent = 'Start'; // Reset button text to "Start"
        }
    }, 1000); // function executes every one second, decreasing the timer until it reaches 0
}

startbtn.addEventListener('click', () => {
    if (startbtn.textContent === 'Start') {
        startGame();
    } else {
        restartGame();
    }
});
