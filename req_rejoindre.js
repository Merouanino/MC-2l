//La requête qui permet de rejoindre la table choisie
"use strict";
const fs = require("fs");
const nj = require("nunjucks");

const req_rejoindre = function (req,res,query){
	let page = fs.readFileSync(`modele_lobby.html`, "UTF-8");	
	let contenu;
	let requete;
	let pathname;
	
	//Récupération du Contexte
	
	let choix = query.choix;
	let pseudo = query.pseudo;
	let lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(lobby);
	let membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	//Traitement
	
	for (let i = 0; i < membres.length; i++){
		if (membres[i].pseudo === pseudo){
			lobby[choix].joueurs.push(i);
		}
	}
	
	let pseudos = [];

	for (let j = 0; j < lobby[choix].joueurs.length; j++){
		pseudos.push(membres[ lobby[j].joueurs ]);
	}
	
	//Mémorisation du Contexte

	contenu = JSON.stringify(lobby);
	fs.writeFileSync("lobbys.json", contenu, "utf-8");

	//Fabrication et envoi de la page HTML

	let marqueurs = {};
	marqueurs["pseudos"] = pseudos;	
	marqueurs.erreur = "";
	marqueurs.pseudo = "";
	page = nj.renderString(page,marqueurs);
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_rejoindre;

