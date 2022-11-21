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
	let mise;
	let coins;

	//Récupération du Contexte
	
	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query
	
	mise = query.mise;
	pseudo = query.pseudo;
	
	lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(lobby);
	
	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

	//Traitement
	for (let i = 0; i < membres.length; i++){
		if (membres[i].pseudo === pseudo){
			membres[i].coins -= Number(mise);
			
		}
	}

	//Mémorisation du Contexte
	
	contenu = JSON.stringify(membres);
	fs.writeFileSync("membres.json", contenu, "UTF-8");

	//Fabrication et envoi de la page HTML

	let marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.mise = mise;

	page = fs.readFileSync(`modele_lobby_plateau.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);

	res.writeHead(200, { 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();

};
module.exports = req_miser;
