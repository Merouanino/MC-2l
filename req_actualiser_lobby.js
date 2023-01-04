"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");
const url = require("url");
const fct = require("./fct_initialisation");

const actualiser_lobby = function (req, res, query) {
	let choix;
	let pseudo;
	let contenu;
    let lobby;
	let membres;
	let tables;
	let pseudos;
	let marqueurs;
	let page;

	choix = query.choix;
	pseudo = query.pseudo;

	//Récupération du contexte
	
	contenu = fs.readFileSync("lobbys.json", "UTF-8");
    lobby = JSON.parse(contenu);
	
	contenu = fs.readFileSync("membres.json", "UTF-8");
    membres = JSON.parse(contenu);
	
	contenu = fs.readFileSync("tables.json", "UTF-8");
    tables = JSON.parse(contenu);

	//Actualiser la liste d'attente avec les pseudo
	
	 pseudos = fct.liste_attente(lobby[choix].joueurs,membres);

	//Mémorisation du Contexte

	contenu = JSON.stringify(tables);
	fs.writeFileSync("tables.json", contenu, "utf-8");

	contenu = JSON.stringify(lobby);
	fs.writeFileSync("lobbys.json", contenu, "utf-8");

	if (tables[choix].joueurs.some(j => membres[j].pseudo === pseudo) && lobby[choix].etape === 1) {
		page = fs.readFileSync("modele_jeu.html", "utf-8");
	}else{
		page = fs.readFileSync("modele_lobby.html", "utf-8");
	}

	marqueurs = {};
	marqueurs["pseudos"] = pseudos;
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.etape = lobby[choix].etape === 0;

	page = nunjucks.renderString(page, marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = actualiser_lobby;

