//La requête qui permet de rejoindre la table choisie
"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require('url');
const fct = require("./fct_initialisation.js");

const req_rejoindre = function (req,res,query){
	let choix;
	let pseudo;
	let lobby;
	let membres;
	let contenu;
	let page;
	
	//Récupération du Contexte
	
	choix = query.choix;
	pseudo = query.pseudo;
	
	lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(lobby);
	
	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

	//Traitement
	
	for (let i = 0; i < membres.length; i++){
		if (membres[i].pseudo === pseudo){
			lobby[choix].joueurs.push(i);
		}
	}
	
	let pseudos = fct.liste_attente(lobby[choix].joueurs,membres);

	//Mémorisation du Contexte

	contenu = JSON.stringify(lobby);
	fs.writeFileSync("lobbys.json", contenu, "utf-8");

	//Fabrication et envoi de la page HTML

	let marqueurs = {};
	marqueurs["pseudos"] = pseudos;	
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.etape = lobby[choix].etape === 0;

	page = fs.readFileSync(`modele_lobby.html`, "UTF-8");	
	page = nj.renderString(page,marqueurs);
	
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_rejoindre;

