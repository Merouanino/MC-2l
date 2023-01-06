"use strict";

const fs = require("fs");
const nj = require("nunjucks");
const url = require('url');
const fct = require("./fct_initialisation.js");

const req_ejecter = function(req, res, query){
    let marqueurs;
    let page;
	let membres;
	let tables;
	let pseudo;
	let choix;
	let joueur;
	let contenu;
	let lobby;
	let indice;

	pseudo = query.pseudo;
    choix = query.choix;

	//Lecture du fichier json

	lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(lobby);
	
	membres = fs.readFileSync("membres.json", "UTF-8");
    membres = JSON.parse(membres);

    tables = fs.readFileSync("tables.json", "UTF-8");
    tables = JSON.parse(tables);

	//récupération du pseudo depuis url et trouve l'indice du joueur dans le tableau joueur
	if([tables[choix].joueurs].length === 1){
		tables[choix].etat = false;
		lobby[choix].etape = 0;
	}

	indice = fct.indice_joueur(membres, pseudo);
	joueur = tables[choix].joueurs.indexOf(indice);
    
	//suppression du joueur ayant été kick de la table
	if(joueur !== -1){
    	tables[choix].joueurs.splice(joueur, 1);
		tables[choix].mises.splice(joueur, 1);
	}

    contenu = JSON.stringify(tables);
    fs.writeFileSync("tables.json", contenu, 'utf-8');

	contenu = JSON.stringify(lobby);
	fs.writeFileSync("lobbys.json", contenu, 'utf-8');

	marqueurs = {};
    marqueurs.pseudo = pseudo;
	marqueurs.credits = membres[choix].coins; 
    marqueurs.choix = choix;
	
	page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);

	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_ejecter;

