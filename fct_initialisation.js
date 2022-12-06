   //Initialisation du paquet de cartes 
"use strict";
const fs = require("fs");

const cartes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
    function carte(cartes){
        const carte_index = Math.floor(Math.random() * cartes.length);
		const carte = cartes[carte_index];
		cartes.splice(carte_index, 1);
		return carte;
    };  

    function couleur(c){
		return [
			"carreau", "coeur",
			"pique", "trefle"
		][Math.floor(c / 13)];
    };  
    
    function valeur(c){
        let v = [(c+1) % 13];
		if(v == 1){
			v = 11;
		}else if(v > 0 && v <= 10){
			return v;
		}else if(v === 0){
			return v = 10;
		}else{
			v = 10;
		}
		return v;
    };  

    
    function carteRandom(cartes){
        return Math.floor(Math.random() * cartes.length);
	};

	function carteInit(){
    let c = [];
	c = c.concat(cartes);
    c = c.concat(cartes);
    c = c.concat(cartes);
    c = c.concat(cartes);
    c = c.concat(cartes);
    c = c.concat(cartes);

    c.sort(()=> Math.random()-0.5);
	return c;	
	};

	function calculbanque(l){
		let total = 0;
		let c = 0;
		for(let i = 0; i < l.length; i++){
			total += Number(valeur(l[i]));
			console.log("total" + total);
			if(Number(valeur(l[i])) === 11){
				c += 1;
			}
		}
			while(total > 21 && c !== 0){
				total -= 10;
				c--;
				console.log("total 10 :" + total);
			}
		return total;
	}

module.exports = {
	carte : carte,
	couleur : couleur,
	valeur : valeur,
	carteRandom : carteRandom,
	carteInit : carteInit,
	calculbanque : calculbanque,
};

