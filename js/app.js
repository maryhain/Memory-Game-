/*
 * Memory Card Matching Game
 *
 * Special thanks to Matt Cranford - https://matthewcranford.com - whose blog helped me a lot.
 */

// Global variables
const deck = document.querySelector('.deck');
let moves = 0;
let toggledCards = [];
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const TOTAL_PAIRS = 8; // 8 pairs wins a game - set to lower than 8 for testing

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function addMove() {
    moves++;
    const movesText = document.querySelector('.moves'); // get span.moves
    movesText.innerHTML = moves; // set span.moves' innerHTML to updated number moves
}

// Shuffle the deck
function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li')); // stores elements to be shuffled as a nodeList
    const shuffledCards = shuffle(cardsToShuffle); // pass cardsToShuffle as an argument to shuffle and store as shuf
    for (card of shuffledCards) { // for each card in the shuffledCards array, append this card to the deck element
        deck.appendChild(card);
    }

}
shuffleDeck();

// push the clickTarget , if it passes our conditionals, into the toggledCards array. last, I’m going to call our new function addToggleCard after the toggleCard invocation.
// only push into our array if less than two cards are in that array.
deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickedValid(clickTarget)) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) { // every time user toggles two cards, check for match
            checkForMatch(clickTarget);
            addMove();
            checkScore(); // call checkScore after every move
            writeModalStats(); // write stats

        }
    }
});

function isClickedValid(clickTarget) {
    return (
        clickTarget.classList.contains('card') && // is it a card
        !clickTarget.classList.contains('match') && //  does the target NOT contain the class match?
        toggledCards.length < 2 && // is array's length less than 2?
        !toggledCards.includes(clickTarget) // does toggledCards array NOT include clickTarget?
    );
}

function toggleCard(card) { // toggle the cards
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function addToggleCard(clickTarget) { // push the clickTarget into the toggledCards array
    toggledCards.push(clickTarget);
    console.log(toggledCards);
}

// if the list already has another card, check to see if the two cards match. Compare the two cards in the array using their index and className
function checkForMatch() {
    if (
        toggledCards[0].firstElementChild.className ===
        toggledCards[1].firstElementChild.className // check each element in the array against each other's child element's className property. this compares the two icons against each other.

    ) {
        toggledCards[0].classList.toggle('match'); //toggle match class on both elements
        toggledCards[1].classList.toggle('match');
        toggledCards = []; // reset the array
        matched++; // increment global variable
        if (matched === TOTAL_PAIRS) { // call gameOver if there are 8 pairs of cards open
            gameOver();
            spinAllCards();
        }

    } else { // length of time unmatched cards stay open. shorter the time, higher the difficulty.

        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
        }, 1000);

    }
}


function checkScore() {
    if (moves === 8 || moves === 16) {
        hideStar();
    }
}

function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display != 'none') { // if the li already has a display set to none, skip it
            star.style.display = 'none';
            break;
        }

    }
}

// time and clock
function displayTime() {
    const clock = document.querySelector('.clock'); // store span.clock in clock
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds < 10) { // pad seconds with a 0 if less than 10 seconds
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`
    }
}


function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

function stopClock() {
    clearInterval(clockId);
}

// modal window
function toggleModal() {
    const modal = document.querySelector('.modal-background');
    modal.classList.toggle('hide');
}

function writeModalStats() {
    const timeStat = document.querySelector('.modal-time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal-moves');
    const starsStat = document.querySelector('.modal-stars');
    const stars = getStars();

    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display != 'none') {
            starCount++;
        }
    }
    return starCount;
}


/*
 * Modal Window Buttons
 */
document.querySelector('.modal-cancel').addEventListener('click', () => {
    toggleModal();
});

/*
 *  Reset
 */

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

function resetMoves() { // set global variable moves to 0, change the score display of moves back to 0.
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() { // reset stars to 0, loop through the starList setting each star's display property back to inline from none
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

document.querySelector('.reset-icon').addEventListener('click', resetGame); // clicking reset button calls resetGame
document.querySelector('.modal-replay').addEventListener('click', replayGame); // clicking modal replay button calls replayGame

function gameOver() { // stop the clock, write to modal, and toggle modal
    stopClock();
    writeModalStats();
    toggleModal();
    matched = 0;
}

function replayGame() { // resets game and closes modal
    resetGame();
    toggleModal();
}

function resetGame() { // resets game without closing modal
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
}


function spinAllCards() { // spin all cards upon successful game completion
    let allMatchedCards = document.querySelectorAll('.card');
    for (card of allMatchedCards) {
        card.className = 'card show all-spin';
    }
}



// TODO: when two cards do not match, apply a shake CSS animation.
// TODO: bootstrap for better mobile play
// TODO: add more stars / half star ratings
// TODO: add leaderboard to store multiple games' scores
// TODO: add capture to add users' initals after winning (or losing!) a game
// TODO: create a scoreboard from CSS to hold the stars, timer, and moves counter.
// TODO: move all completed matches into section below the board.


