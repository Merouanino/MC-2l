"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");;
const url = require("url");

const actualiser_lobby = function (req, res, query) {
	let requete;
	let pathname;
	let contenu;
    let lobby;
	let membres;
	let pseudo;
	let pseudos;
	let continuer;
	let joueur;
	let joueur_attente;
	let choix;
	let marqueurs;

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;
	
	choix = query.choix;

	//Récupération du contexte
	
	contenu = fs.readFileSync("lobbys.json", "UTF-8");
    lobby = JSON.parse(contenu);
	
	contenu = fs.readFileSync("membres.json", "UTF-8");
    membres = JSON.parse(contenu);
	
	//Actualiser la liste d'attente avec les pseudo

	pseudo = query.pseudo;
	pseudos = [];

	for(let i = 0; i < lobby[choix].joueurs.length; i++){
		pseudos.push(membres[lobby.joueurs[i].pseudo]);
	}

    //Mémorisation du Contexte

    contenu = JSON.stringify(lobby);
    fs.writeFileSync("lobby.json", contenu, "utf-8");
	
	//Vérifier si la table est libre
	//on veut récupérer les personnes qui désire continuer la partie à la fin d'une manche et leur pseudo
	

	joueur = tables.joueurs;
	joueur_attente = lobby.joueurs;

	continuer = lobby.continuer; //on souhaite récupérer cette information sur chaque joueur ayant fait ce choix
	joueur_continuer = lobby.pseudo;

	/*if(continuer === true){
		for(let i = joueur.length; i < 4; i ++){
			joueur.push(joueur_attente[0]);
			joueur_attente.splice(0, 1);
		}
	}*/

	/*for(let i = 0; i < 4; i++){
		

	}*/
	
	marqueurs = {};
	marqueurs.pseudo = "";

	page = nunjucks.renderString(page, marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = actualiser_lobby;

