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
	let continuer;
	let indice_pseudo;

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

	//Recup l'indice du joueur dans la liste des joueurs du fichier tables.json

	indice_pseudo = tables[choix].joueurs.indexOf(pseudo);

	//initialisation de la liste des mises
	for(let i = 0; i < 4; i++){
		tables[choix].mises.push(null);
	}


	//Traitement
	
	for (let i = 0; i < membres.length; i++){
		if (membres[i].pseudo === pseudo && membres[i].coins > mise && membres[i].coins - mise > 0){
			membres[i].coins -= mise;
			
		}
	}
	
	//ajoute la mise des joueurs 
	
	for (let j = 0; j < membres.length; j++){
		if (membres[j].pseudo === pseudo && tables[choix].etat === true){
			tables[choix].mises.splice(indice_pseudo, 1, mise);
			//tables[choix].mises.push(mise);
		}
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
	page = fs.readFileSync(`modele_lobby_plateau.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);

	res.writeHead(200, { 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();

};
module.exports = req_miser;
