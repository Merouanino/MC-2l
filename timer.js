"use strict";

const startingMinutes = 0.20; // temps en min 
const countdownEl = document.getElementById('timer');
let time = startingMinutes * 60;

setInterval(updateCountdown, 1000) // 1 sec

function updateCountdown(){
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    if(time > 0){
      time--;
    }
}
