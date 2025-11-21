import { highScoreSave, highScoreLoad } from "./highscore.js";
import { timerStop } from "./timer.js";

const domCase = document.getElementById("case")
const domScore = document.getElementById("score")

export let targetCase = null; // ex: "a5"
let excludesCase = null; // cell to exclude from random selection 
let score = 0;
export let highScore = 0;
export let endGame = false; // status of the game
let lastColoredCell = null; // to manage colored cells

let x = ["a", "b", "c", "d", "e", "f", "g", "h"];
let y = [1, 2, 3, 4, 5, 6, 7, 8];



// Get a random case from x and y
export async function getRandomCase() {
    if (!endGame) {
        let randomIndexX = Math.floor(Math.random() * x.length)
        let randomIndexY = Math.floor(Math.random() * y.length)
        targetCase = [x[randomIndexX], y[randomIndexY]].join('');
        if (targetCase === excludesCase) {
            getRandomCase(x, y);
        }
        console.log(targetCase);
        displayCase();
    }
}

// Change the color of the cell
export async function colorCase(clickedCase, color) {
    if (endGame) {
        return;
    }
    const cell = document.querySelector('[data-value="' + clickedCase + '"]');

    if (lastColoredCell) {
        lastColoredCell.style.background = lastColoredCell.dataset.previousColor || "";
        lastColoredCell = null;
    }

    cell.dataset.previousColor = getComputedStyle(cell).background;
    cell.style.background = color;
    excludesCase = clickedCase;

    lastColoredCell = cell;

    await sleep(500);

    cell.style.background = cell.dataset.previousColor;
}

// Check if the clicked case is the target case
export async function checkCase(clickedCase) {
    if (endGame) {
        return false;
    }
    if (clickedCase === targetCase) {
        colorCase(clickedCase, "#00FF00");
        getRandomCase();
        if (!endGame) {
            score = score + 1;
            displayScore();
            return true;
        }
    }
    else {
        colorCase(clickedCase, "red");
        return false;
    }
}

async function displayCase() {
    domCase.textContent = targetCase;
}

async function displayScore() {
    domScore.textContent = score;
}

export async function gameCloser() {
    endGame = true;
    timerStop();
    if (score > highScore) {
        await highScoreSave(score);
        highScore = score;
    }
}

export async function gameStarter() {
    await getRandomCase();
    highScore = await highScoreLoad();
    console.log(highScore);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
