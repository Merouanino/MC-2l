//La requête qui récupère la mise de joueur 
"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require("url");
const fct = require("./fct_initialisation.js");

const req_miser = function (req,res,query){
	let mise;
	let pseudo;
	let choix;
	let lobby;
	let membres;
	let tables;
	let indice;
	let indice_pseudo;
	let contenu;
	let page;

	//Récupération du Contexte
	
	mise = Number(query.mise);
	pseudo = query.pseudo;
	choix = query.choix;

	lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(lobby);
	
	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);
	
	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);

	//recup l'indice du joueur dans membres.json
	
	indice = fct.indice_joueur(membres,pseudo);

	//Traitement
	//Recup l'indice du joueur dans la liste des joueurs du fichier tables.json
	
	indice_pseudo = tables[choix].joueurs.indexOf(indice);
	
	//ajoute la mise des joueurs 
	
	if (membres[indice].coins >= mise){
		membres[indice].coins -= mise;
		tables[choix].mises[indice_pseudo] = mise;
		page = fs.readFileSync(`modele_lobby_plateau.html`, "UTF-8");
	}else{
		// TODO: Réafficher la page si la mise est trop grande.
		page = fs.readFileSync(`modele_jeu.html`, "UTF-8");
	}
	//Mémorisation du Contexte
	
	contenu = JSON.stringify(membres);
	fs.writeFileSync("membres.json", contenu, "UTF-8");

	contenu = JSON.stringify(tables);
	fs.writeFileSync("tables.json", contenu, "UTF-8");

	//Fabrication et envoi de la page HTML

	let marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.mise = mise;
	marqueurs.choix = choix;
	
	page = nj.renderString(page,marqueurs);

	res.writeHead(200, { 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();

};
module.exports = req_miser;
