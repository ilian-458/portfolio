import { checkCase, gameStarter, endGame} from "./main.js";
import { timerStart, timerIsRunning, pickTimerFromDom } from "./timer.js";

// called on each click and call the checkCase function 
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
                if (!timerIsRunning) {
                timerStart();
            }
            } else {
                console.log("Incorrect!");
            }
        });
    });
}

export async function startGame() {
    await pickTimerFromDom();
    gameStarter();
    clickedcase();
}