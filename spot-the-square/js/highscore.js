const domHighScore = document.getElementById("highScore")
let mode = domHighScore.dataset.mode; // game mode from data attribute

// Load high score from local storage
export async function highScoreLoad(){
    let highScore = localStorage.getItem("highScore_" + mode) || 0;
    domHighScore.textContent = highScore;
    return highScore;
}

export async function highScoreSave(score){
    localStorage.setItem("highScore_" + mode, score);
}