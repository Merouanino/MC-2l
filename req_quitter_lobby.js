"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");;
const url = require('url');

const req_quitter_lobby = function (req, res, query) {
	let requete;
	let pathname;
    let marqueurs;
	let page;
    let lobby;
	let joueur;
	let choix;

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;

	//Lecture du fichier json 
	lobby = fs.readFileSync("lobbys.json", "UTF-8");
    lobby = JSON.parse(lobby);

	//récupération du pseudo depuis url et trouve l'indice du joueur dans le tableau joueur
	choix = query.choix;

	joueur = query.pseudo;
	joueur = lobby[choix].joueurs.indexOf(joueur);
	//joueur = lobby.joueurs.indexOf(joueur);
	//choix = lobby.choix.indexOf(choix);
	
	//supprétion du joueur ayant quitter le lobby
	lobby.joueurs.splice(joueur, 1); // faut recup la bonne liste -> bon choix (table)
	//lobby.splice(joueur, 1); // supp ce que contient json sniff ;-;
	lobby = JSON.stringify(lobby);
	lobby = fs.writeFileSync("lobbys.json", lobby, 'utf-8');

	//page = nunjucks.renderString(page, marqueurs);
	page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = req_quitter_lobby;

