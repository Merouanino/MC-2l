"use strict";

const fs = require("fs");
const nj = require("nunjucks");;
const url = require('url');

const req_quitter_lobby = function (req, res, query) {
	let requete;
	let pathname;
	let marqueurs;
	let page;
	let tables;
	let pseudo;
	let choix;
	let members;


	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	//Lecture du fichier json 
		
	members = fs.readFileSync("membres.json", "UTF-8");
	members = JSON.parse(members);

	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);

	//récupération du pseudo depuis url et trouve l'indice du joueur dans le tableau joueur
	
	pseudo = query.pseudo;
	choix = query.choix;
	pseudo = tables[choix].joueurs.indexOf(pseudo);
	
	//supprétion du joueur ayant quitter la table
	
	tables[choix].joueurs.splice(pseudo,1);
	
	tables = JSON.stringify(tables);
	tables = fs.writeFileSync("tables.json", tables, 'utf-8');
	
	page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");
	
	marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	
	page = nj.renderString(page,marqueurs);
    
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_quitter_lobby;

