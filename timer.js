"use strict";

const startingMinutes = 0.20; // temps en min 
const countdownEl = document.getElementById('timer');
let time = startingMinutes * 100;
let pseudo;
let choix;

setInterval(updateCountdown, 1000) // 1 sec

const _url = new URL(document.location);
choix = _url.searchParams.get("choix");
pseudo = _url.searchParams.get("pseudo");
console.log(pseudo + choix);

function updateCountdown(){
    const minutes = Math.floor(time / 100);
    let seconds = time % 100;
	
    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    if(time > 0){
      time--;
    }else{
		document.location = "/req_ejecter?choix=" + choix + "&pseudo=" + pseudo;
	}
}
