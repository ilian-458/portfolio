import { gameCloser, colorCase, targetCase } from "./main.js";
import { delLife } from "./survival.js";

export let timerId = null; // ID of the timer interval to interact with it
let timer = 0; // time remaining in ms
export let timerIsRunning = false; // status of the timer
let domTimer = null;

async function getDomTimer(){
    if (domTimer) return;
    domTimer = document.getElementById("timer");
}

export async function pickTimerFromDom(){
    await getDomTimer();
    let timerText = domTimer.textContent.trim();
    let [min, sec] = timerText.split(":").map(Number);
    timer = ((min || 0) * 60 + (sec || 0)) * 1000;
    displayTimer(timer);
}

export async function littleTimerStart(delay){
    timer = delay;
    littleTimerUpdate();
    if (!timerIsRunning) {
        timerId = setInterval(littleTimerUpdate, 10);
        timerIsRunning = true;
    }
}

async function littleTimerUpdate(){
    if (timer <= 1) {
        colorCase(targetCase, "red");
        await delLife();
    }
    else {
        timer = timer - 10;
    }
    littleDisplayTimer(timer);
}

async function littleDisplayTimer(time){
    getDomTimer();
    let seconds = Math.floor(time / 1000);
    let tenthSecond = Math.floor((time - seconds*1000) / 10);
    domTimer.textContent = `${seconds},${tenthSecond.toString().padStart(2, '0')}`;
}

export async function timerStart(){
    timerUpdate();
    if (!timerIsRunning) {
        timerId = setInterval(timerUpdate, 1000); // Update every second
        timerIsRunning = true;
    }
}

async function displayTimer(time){
    let totalSeconds = Math.floor(time / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    domTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function timerUpdate(){
    if (timer <= 1) {
        elapsedTime();
        gameCloser();
        timerStop();
    }
    else {
        timer = timer - 1000;
    }

    displayTimer(timer);
}

export async function timerStop(){
    if (timerIsRunning) {
        console.log("Stopping timer");
        clearInterval(timerId);
        timerIsRunning = false;
    }
}

// function to display a message when the time is up
async function elapsedTime(){
    const message = document.createElement("div");
    message.textContent = "temps écoulé";
    message.style.position = "fixed";
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.fontSize = "4rem";
    message.style.color = "#e74c3c";
    message.style.background = "rgba(255,255,255,0.8)";
    message.style.padding = "1rem 2rem";
    message.style.borderRadius = "1rem";
    message.style.zIndex = "1000";
    message.style.opacity = "0";
    message.style.transition = "opacity 0.6s";

    document.body.appendChild(message);

    setTimeout(() => {
        message.style.opacity = "1";
    }, 50);

    setTimeout(() => {
        message.style.opacity = "0";
        setTimeout(() => {
            message.remove();
        }, 600);
    }, 1500);
}