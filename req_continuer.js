"use strict";

const fs = require("fs");
const nj = require("nunjucks");;
const url = require('url');
const fct = require("./fct_initialisation.js");

const req_continuer = function (req, res, query) {
	let pseudo;
	let choix;
	let contenu;
	let membres;
	let lobbys;
	let coins;
	let tables;
	let page;
    let marqueurs;
	let indice;

	//Récupération des crédits associés au compte
	
	pseudo = query.pseudo;
	choix = query.choix;

	//Lecture du fichier json 
	
	contenu = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(contenu);
	
	contenu = fs.readFileSync("lobbys.json", "UTF-8");
	lobbys = JSON.parse(contenu);

	indice = fct.indice_joueur(membres,pseudo);

	lobbys[choix].joueurs.push(indice);

	let pseudos = fct.liste_attente(lobbys[choix].joueurs,membres); 

	//on enregistre

	contenu = JSON.stringify(lobbys);
	fs.writeFileSync("lobbys.json", contenu, "UTF-8");

	marqueurs = {};
	marqueurs["pseudos"] = pseudos;
	marqueurs.etape = lobbys[choix].etape === 0;
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.credits = coins;
	
	page = fs.readFileSync(`modele_lobby.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);
    
	res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = req_continuer;

