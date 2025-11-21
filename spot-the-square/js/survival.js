import { littleTimerStart, timerIsRunning, timerStop} from "./timer.js";
import { checkCase, gameStarter, gameCloser, endGame, getRandomCase, sleep } from "./main.js";

let lifes = 3;

// est apellé a chaque clic et recupere si la case est bonne 
async function clickedcase() {
    const cells = document.querySelectorAll(".blue, .white");
    cells.forEach(cell => {
        cell.addEventListener("click", async () => {
            const value = cell.dataset.value;
            if (endGame) {
                return;
            }
            let check = await checkCase(value);
            if (check === true) {
                console.log("Correct!");
                await timerStop();
                if (!timerIsRunning) {
                    littleTimerStart(3000);
                }
            } else {
                delLife();
                console.log("Incorrect!");
            }
        });
    });
}

export async function delLife() {
    
    timerStop();
    lifes--;
    if (lifes <= 0) {
        gameCloser();
        console.log("Game Over");
        
    }
    else {
        getRandomCase();
        littleTimerStart(3000);
    }

    lifeUpdate();
}

async function lifeUpdate() {
    if (lifes === 2) {
        let heart3 = document.getElementById("heart3");
        heart3.classList.add("heart-dark");
        heart3.classList.remove("heart");
    }
    if (lifes === 1) {
        let heart2 = document.getElementById("heart2");
        heart2.classList.add("heart-dark");
        heart2.classList.remove("heart");
    }
    if (lifes === 0) {
        let heart1 = document.getElementById("heart1");
        heart1.classList.add("heart-dark");
        heart1.classList.remove("heart");
    }
    console.log("Lifes: " + lifes);
}

export async function startGame() {
    await gameStarter();
    clickedcase();
}