"use strict";

const fs = require("fs");
const nj = require("nunjucks");;
const url = require('url');

const req_quitter = function (req, res, query) {
	let pseudo;
	let choix;
	let members;
	let coins;
	let indice;
	let marqueurs;
	let page;

	pseudo = query.pseudo;
	choix = query.choix;

	//Lecture du fichier json 
		
	members = fs.readFileSync("membres.json", "UTF-8");
	members = JSON.parse(members);

	//recup l'indice du joueur dans membre
	for (let i = 0; i < members.length; i++){
        if(members[i].pseudo === pseudo){
            coins = members[i].coins;
			indice = i;
        }
    }
	
	marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.credits = coins;
	
	page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);
    
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_quitter;

