"use strict";

const fs = require("fs");
const nj = require("nunjucks");;
const url = require('url');

const req_quitter_lobby = function (req, res, query) {
	let requete;
	let pathname;
    let marqueurs;
	let page;
    let joueur;
	let tables;
	let pseudo;
	let choix;

	//Récupération des crédits associés au compte

	let coins;
	let members;
	
	pseudo = query.pseudo;
	
	members = fs.readFileSync("membres.json", "UTF-8");
	members = JSON.parse(members);
	
	for (let i = 0; i < members.length; i++){
		if(members[i].pseudo === pseudo){
			coins = members[i].coins;
		}
	}

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;

	//Lecture du fichier json 
	
	tables = fs.readFileSync("tables.json", "UTF-8");
    tables = JSON.parse(tables);

	//récupération du pseudo depuis url et trouve l'indice du joueur dans le tableau joueur
	
	choix = query.choix;
	joueur = lobby[choix].joueurs.indexOf(joueur);
	
	//supprétion du joueur ayant quitter le lobby
	
	lobby[choix].joueurs.splice(joueur, 1);
	
	tables = JSON.stringify(tables);
	tables = fs.writeFileSync("tables.json", tables, 'utf-8');
	
	page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");
	
	marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.credits = coins;
	
	page = nj.renderString(page,marqueurs);
    
	res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = req_quitter_lobby;

