"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");
const url = require("url");

const actualiser_lobby = function (req, res, query) {
	let requete;
	let pathname;
	let choix;
	let contenu;
    let lobby;
	let membres;
	let tables;
	let pseudo;
	let pseudos;
	let continuer;
	let joueur;
	let marqueurs;
	let page;
	let nul;

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;
	
	choix = query.choix;

	//Récupération du contexte
	
	contenu = fs.readFileSync("lobbys.json", "UTF-8");
    lobby = JSON.parse(contenu);
	
	contenu = fs.readFileSync("membres.json", "UTF-8");
    membres = JSON.parse(contenu);
	
	contenu = fs.readFileSync("tables.json", "UTF-8");
    tables = JSON.parse(contenu);

	//Actualiser la liste d'attente avec les pseudo

	pseudo = query.pseudo;
	pseudos = [];

	for(let i = 0; i < lobby[choix].joueurs.length; i++){
		pseudos.push(membres[lobby[choix].joueurs[i]]);
	}

    //Mémorisation du Contexte

    contenu = JSON.stringify(lobby);
    fs.writeFileSync("lobbys.json", contenu, "utf-8");
	
	//Vérifier si la table est libre
	
	continuer = tables[choix].etat;
	
	//on veut récupérer le nb de personnes qui désire continuer la partie à la fin d'une manche

	for(let j = 0; j < tables[choix].joueurs.length; j++){
        nul = tables[choix].joueurs.indexOf(null);
        tables[choix].joueurs.splice(nul, 1);
    }


	if(continuer === true){
		joueur = 5 - tables[choix].joueurs.length;

		for(let i = 0; i < joueur; i++){
			tables[choix].joueurs.push(lobby[choix].joueurs[0]);
			lobby[choix].joueurs.splice(0, 1);
		}
		tables[choix].etat = true;
		page = fs.readFileSync("modele_jeu.html", "utf-8");
	}else{
		page = fs.readFileSync("modele_lobby.html", "utf-8");
	}


	//Mémorisation du Contexte

	tables = JSON.stringify(tables);
	fs.writeFileSync("tables.json", tables, "utf-8");

	lobby = JSON.stringify(lobby);
	fs.writeFileSync("lobbys.json", lobby, "utf-8");

	marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;

	page = nunjucks.renderString(page, marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = actualiser_lobby;

