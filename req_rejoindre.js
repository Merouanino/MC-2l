//La requête qui permet de rejoindre la table choisie
"use strict";
const fs = require("fs");
const nj = require("nunjucks");

const req_rejoindre = function (req,res,query){
	let page = fs.readFileSync(`lobby.html`, "UTF-8");	
	let contenu;
	//Récupération du Contexte
	let choix = query.choix;
	let pseudo = query.pseudo;
	let lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(contenu);
	let membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);
	//Traitement
	for (let i = 0; i < membres.length; i++){
		if (membres[i].pseudo === pseudo){
			lobby[choix].joueurs.push(i);
		}
	}
	
	pseudos = [];

	for (let j = 0; j < lobby[choix].joueurs.length; j++){
		pseudos.push(membres[ lobby.joueurs[i] ];
	}
	
	//Mémorisation du Contexte

	contenu = JSON.stringify(lobby);
	fs.writeFileSync("lobby.json", contenu, "utf-8");

	//Fabrication et envoi de la page HTML

	let marqueurs = {};
	marqueurs.erreur = "";
	marqueurs.pseudo = "";
	page = nj.renderString(page,marqueurs);
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_rejoindre;

