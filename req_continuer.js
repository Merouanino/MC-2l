"use strict";

const fs = require("fs");
const nj = require("nunjucks");;
const url = require('url');

const req_continuer = function (req, res, query) {
	let requete;
	let pathname;
	let pseudo;
	let contenu;
	let membres;
	let coins;
	let tables;
	let page;
    let marqueurs;
	let choix;

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;

/*	for (let i = 0; i < membre.length; i++){
		if(membre[i].pseudo === pseudo){
			coins = membre[i].coins;
		}
	}
*/

	//Récupération des crédits associés au compte
	
	pseudo = query.pseudo;
	choix = query.choix;


	//Lecture du fichier json 
	
	contenu = fs.readFileSync("tables.json", "UTF-8");
    tables = JSON.parse(contenu);
	
	contenu = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(contenu);
	

	//initialisation des cartes du joueur et de la banque
	for(let j = 0; j < tables[choix].main.length; j++){
		tables[choix].main[j] = [];
	}


	//initialisation de la liste des mises
    for(let j = 0; j < 4; j++){
        tables[choix].mises.splice(0, 1);
    }

	tables[choix].banque = [];
	tables[choix].etat = true;
	tables[choix].actif = 0;
	
	//on enregistre

	contenu = JSON.stringify(tables);
	contenu = fs.writeFileSync("tables.json", contenu, "UTF-8");
	
	page = fs.readFileSync(`modele_jeu.html`, "UTF-8");
	
	marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.credits = coins;
	
	page = nj.renderString(page,marqueurs);
    
	res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = req_continuer;

