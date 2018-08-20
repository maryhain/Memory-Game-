// -------GLOBAL --------
const deck = document.querySelector('.deck');
//const x = document.querySelector('.restartbtn');
let toggledCards = []; // store all cards in an array
let moves = 0;
// Global variables for clock
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
// set matched return to zero
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
 }
 shuffleDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function initGame() {
    let newCards = shuffle(cardArray);
    cards.forEach(function (element, index) {
        cards[index].className = "card";
        cards[index].firstElementChild.className = newCards[index];
    });
}

/*
 * make event listener for a card. If a card is clicked:
 *  - display the card's picture if clicked on the card 
 *  - add the card to a *list* of "open" cards
 *  - if the list already has another card, check to see if the two cards matched or not
 *   - if the cards matched, lock the cards in the open position
 *   - if the cards do not match, remove the cards from the list and hide the card's picture 
 *    - if all cards have matched, display a message with the final score and final message "Great Job!"
 */

 deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) {
            checkForMatch();
            addMove();
            checkScore();
        }
    }
 });

// check that target doesnt contain class "card" & match",checked no more than 2 cards
function isClickValid(clickTarget) {
    return (
            clickTarget.classList.contains('card') && 
            !clickTarget.classList.contains('match') &&
            toggledCards.length < 2 &&
            !toggledCards.includes(clickTarget)
        );
}

// Clock Function  
function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

// Displays the current time in the scoreboard
function displayTime() {
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

// Function to toggle cards
function toggleCard(card){
    card.classList.toggle('open');
    card.classList.toggle('show');
 }

// Function to push clickTarget into toggleCards array
function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);
}

// Function to check if the cards match
function checkForMatch() {
    const TOTAL_PAIRS = 8;
    if (
        toggledCards[0].firstElementChild.className === 
        toggledCards[1].firstElementChild.className
        ) { // Toggle match class
            toggledCards[0].classList.toggle('match');
            toggledCards[1].classList.toggle('match'); 
            toggledCards = [];
            matched++; 
            if (matched === TOTAL_PAIRS) {
                gameOver();
             modal.reload(true); 
            }
else if (matched === 16){
  gameOver();
   modal.reload(true);
}
      else if (matched === 0)
        {
          gameOver();
           modal.reload(true);
        }
    } else {
        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
    }, 1000);
    }
}
// game over function
function gameOver() {
 // if (matched.length == 16){
     //  modal.classList.add('show');  
    stopClock();
    toggleModal();
    writeModalStats();
    initGame();
 // }
 // closeModal();
  //toggleCard(card);
}

// Stops the clock
function stopClock() {
  //if (matched.length == 8){
    clearInterval(clockId);
       // modal.classList.add("show");
  //}
 }

 const modal = document.getElementById("popup1");
// ---Make POP UP MODAL --- //
function toggleModal() {
  
     const modal = document.querySelector('.modal_background');
  
  modal.classList.toggle('hide');

 }
    
function writeModalStats() {
   
        // show congratulations modal
       
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const moveStat = document.querySelector('.modal_moves');
    const starStat = document.querySelector('.modal_stars');
    const stars = getStars();

    timeStat.innerHTML = `Time = ${clockTime}`;
    moveStat.innerHTML = `Moves = ${moves}`;
    starStat.innerHTML = `Stars = ${stars}`;

closeModal();
}



// gets stars
function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

//  count moves for scoreboard
function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}
// Calculate stars for scoreboard
function checkScore() {
    if (moves === 16 || moves === 24) {
        hideStar();
    }
}
// Hides the stars
function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

// --- MODAL BUTTONS----//

// Cancel button
document.querySelector('.modal_cancel').addEventListener('click' , () => {
    toggleModal();
});

// Replay button
document.querySelector('.modal_replay').addEventListener('click' , replayGame);

// replay the game function
function replayGame() {
    resetGame();
    toggleModal();
  
}

// resets the game when clicking on refresh button  
document.querySelector('.restartbtn').addEventListener('click', resetGame);
//document.getElementById(' restartbtn').addEventListener('click', resetClockAndTime );

function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
    resetCards();
}

// Resets the clock
function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
      //  initGame();
    });
}

// Resets moves
function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

// Resets stars
function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

// Resets all cards
function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}

