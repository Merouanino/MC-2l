   //Initialisation du paquet de cartes 
"use strict";
const fs = require("fs");
const cartes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
    function carte(cartes){
        return Math.floor(Math.random() * 52);
    };  

    function couleur(c){
        return c / 13; 
    };  
    
    function valeur(c){
        let v;
        if(c >= 10){
            v = 10; 
        }else if(c === 0){ 
            v = 11; 
        }else{
            v = c + 1;
        }
        return v;
    };  

    
    function carteRandom(cartes){
        return Math.floor(Math.random() * cartes.length);
	};

	function carteInit(cartes){
    let c = [];
	c = c.concat(cartes);
    c = c.concat(cartes);
    c = c.concat(cartes);
    c = c.concat(cartes);
    c = c.concat(cartes);
    c = c.concat(cartes);

    c.sort(()=> Math.random()-0.5);
	
	};
module.exports = {
	carte : carte,
	couleur : couleur,
	valeur : valeur,
	carteRandom : carteRandom,
	carteInit : carteInit
};
