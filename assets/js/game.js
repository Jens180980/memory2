// importerer funktion fra model
import { GoalModel } from './model.js';
let arrGoalArray = GoalModel();

// Gameboard
const gameboard = document.getElementById('game');
const timeboard = document.getElementById('timer')
// Antal kort
const num_cards = 4;
// Array til active cards
const arr_flipped = [];
// Array til Highscore
const arr_highScore = []
// Tæller par
let pairs = 0;
// Timer Vars
let miliseconds = 0;
let seconds = '00';
let minutes = '00';
let timer;

// Initialiserer spillet
initGame(num_cards);

/**
 * Initialiser spil
 */
function initGame(num_cards) {
    // Sorter array tilfældigt
    arrGoalArray.sort(() => Math.random() - 0.5);
    // Slicer array til num_cards
    arrGoalArray = arrGoalArray.slice(0, num_cards);
    // // Sammenkæder array med sig selv
    arrGoalArray = arrGoalArray.concat(arrGoalArray);
    // // Sorter array tilfældigt
    arrGoalArray.sort(() => Math.random() - 0.5);


    // Looper goal array
    for(let card of arrGoalArray) {

        // Opretter div element med class
        let div = document.createElement('div');
        div.classList.add('flip-card-inner');

        // Opretter img med src og class og tilføjer til div 
        let img = document.createElement('img');
        img.setAttribute('src', `/assets/images/17goals/${card.image}`);
        img.classList.add('flip-card-front');
        div.appendChild(img);

        // Opretter div back element med class og tilføjer til div
        let back = document.createElement('div');
        back.classList.add('flip-card-back');
        div.appendChild(back);

        // Tilføjer click event til div
        back.addEventListener('click', function() {
            flipCard(this.parentNode);
        })

        // Appender div til gameboard
        gameboard.appendChild(div);
    }
}

function flipCard(divElm) {
    if(!miliseconds) {
        setTimer();
        timer = setInterval(setTimer, 10)
    }

    divElm.classList.add('active');
    // Tilføjer element til array flipped
    arr_flipped.push(divElm);

    if(arr_flipped.length === 2) {
        if(arr_flipped[0].innerHTML === arr_flipped[1].innerHTML) {
            pairs++;
            arr_flipped.length = 0;
            if(pairs === num_cards) {
                gameOver()
                clearInterval(timer);
            }
        } else {
            setTimeout(() => {
                for(let item of arr_flipped) {
                    item.classList.remove('active');
                }
                arr_flipped.length = 0;
            }, 1400);
        }
    }
}

function setTimer() {

    miliseconds++;
    miliseconds = (miliseconds < 10 ? '0' : "") + miliseconds;

    if(miliseconds > 99) {
        seconds++;
        seconds = (seconds < 10 ? '0' : "") + seconds;
        miliseconds = 0;

        if(seconds > 59) {
            minutes++;
            minutes = (minutes < 10 ? '0' : "") + minutes;
            seconds = 0;
        }
    }
    timeboard.innerText = `${minutes}:${seconds}:${miliseconds}`;
}

function gameOver() {
    let timeStart = `${minutes}:${seconds}:${miliseconds}`
    let div = document.createElement('div')
    div.classList.add('gameover')
    div.innerHTML = `
        <h1>Spillet er færdigt</h1>
        <p>Din tid var ${timeStart}</p>
        <button id="playagain">Spil igen</button>`

        highScore(div)
        document.body.append(div)

        arr_highScore.push(timeStart)

        const playAgain = document.getElementById('playagain')
        playAgain.addEventListener('click', () => reset(div))
}

function reset(div) {
    miliseconds = 0;
    seconds = '00';
    minutes = '00';
    timeboard.innerText = `${minutes}:${seconds}:${miliseconds}`
    gameboard.innerHTML = ''
    div.innerHTML = ''
    div.classList.remove('gameover')
    arrGoalArray = GoalModel()
    pairs = 0
    initGame(num_cards);
}

function highScore(appendHtml) {
    const highScoreWrap = document.createElement('section')
    highScoreWrap.classList.add('high-score-wrap')
    const highScoreHeader = document.createElement('h2')
    highScoreHeader.innerText = 'Dine tidligere tider:'
    highScoreWrap.append(highScoreHeader)

    arr_highScore.sort()

    for(let i = 0; i < arr_highScore.length; i++) {
        let bestTime = document.createElement('p')
        bestTime.innerText = arr_highScore[i]
        highScoreWrap.append(bestTime)
    }

    appendHtml.append(highScoreWrap)
}
