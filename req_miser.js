//La requête qui récupère la mise de joueur 
"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require("url");

const req_miser = function (req,res,query){
	let page;
	let contenu;
	let requete;
	let pathname;
	let pseudo;
	let lobby;
	let membres;
	let tables;
	let mise;
	let coins;
	let choix;

	let joueur;
	let indice_pseudo;
	let i;
	let indice;

	//Récupération du Contexte
	
	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query
	
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
	for(i = 0; i < membres.length ; i++){
		if(membres[i].pseudo === pseudo){
			indice = i;
		}
	}

	//Traitement

	//Recup l'indice du joueur dans la liste des joueurs du fichier tables.json
	indice_pseudo = tables[choix].joueurs.indexOf(indice);
	//ajoute la mise des joueurs 
	
	if (membres[indice].coins >= mise){
		membres[indice].coins -= mise;
		tables[choix].mises[indice_pseudo] = mise;
	}
	// TODO: Réafficher la page si la mise est trop grande.

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
	page = fs.readFileSync(`modele_lobby_plateau.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);

	res.writeHead(200, { 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();

};
module.exports = req_miser;
