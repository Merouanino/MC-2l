"use strict";

const fs = require("fs");
const nj = require("nunjucks");;
const url = require('url');
const fct = require("./fct_initialisation.js");

const req_quitter_lobby = function (req, res, query) {
    let marqueurs;
	let page;
    let joueur;
	let lobby;
	let pseudo;
	let choix;
	let coins;
	let members;
	let tables;
	let contenu;
	let indice;

	//Lecture du fichier json 
	
	members = fs.readFileSync("membres.json", "UTF-8");
	members = JSON.parse(members);

	lobby = fs.readFileSync("lobbys.json", "UTF-8");
    lobby = JSON.parse(lobby);
	
	//Récupération des crédits associés au compte

	pseudo = query.pseudo;
	coins = fct.coins_joueur(members,pseudo);
	
	//récupération du pseudo depuis url + trouve l'indice du joueur dans le tableau joueur
	
	choix = query.choix;
	indice = fct.indice_joueur(members, pseudo);
	joueur = lobby[choix].joueurs.indexOf(indice);
	
	//suppression du joueur ayant quitté le lobby
	
	if(joueur !== -1){	
		lobby[choix].joueurs.splice(joueur, 1);
	}

	contenu = JSON.stringify(lobby);
	fs.writeFileSync("lobbys.json", contenu, 'utf-8');
	
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

module.exports = req_quitter_lobby;

