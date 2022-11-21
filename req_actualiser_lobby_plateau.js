"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");
const url = require("url");

const actualiser_lobby = function (req, res, query) {
	let requete;
	let pathname;
	let contenu;
	let lobby;
	let membres;
	let tables;
	let choix;
	let joueur;
	let marqueurs;
	let page;

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;
	
	//Récupération du contexte
	
	contenu = fs.readFileSync("lobbys.json", "UTF-8");
    lobby = JSON.parse(contenu);
	
	contenu = fs.readFileSync("membres.json", "UTF-8");
    membres = JSON.parse(contenu);
	
	contenu = fs.readFileSync("tables.json", "UTF-8");
    tables = JSON.parse(contenu);
	
	choix = query.choix;

	//Vérifie que les joueurs sont là et récupère leur mise, si ts les joueurs du tab sont là on les envoit vers le plateau

	joueur = tables[choix].joueurs;
	joueur_mise = tables[choix].mises;
	
	//rajouter mise dans json
	if(joueur.length === joueur_mise.length){
		page = fs.readFileSync("modele_lobby_plateau.html", "utf-8");
	}

	marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.mise = mise;

	page = nunjucks.renderString(page, marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = actualiser_lobby;

