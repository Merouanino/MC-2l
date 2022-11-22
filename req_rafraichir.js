//La requête qui gère la progression du jeu dans la table
"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require('url');

const req_rafraichir = function (req,res,query);{
	
	let page = read.FileSync(`modele_plateau.html`, "UTF-8");
	let contenu;
	let requete;
	let pathname;
	let choix;
	let pseudo;
	let lobby;
	let membres;
	let table;
	let resultat;
	let somme;
	let gains;
	let mise;
	let blackjack;
	let carte = {};
	carte["1"] = 1; carte["2"] = 2; carte["3"] = 3; carte["4"] = 4; carte["5"] = 5; carte["6"] = 6; carte["7"] = 7; carte["8"] = 8;carte["9"] = 9 ;carte["10"] = 10 ;carte["J"] = 10 ;carte["Q"] = 10;carte["K"] = 10 ;	
	let couleur ={}
	couleur["coeur"] : 1; couleur["carreau"] : 2; couleur["pique"] : 3; couleur["trefle"] : 4;

	//Récupération du Contexte

	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	mise = Number(query.mise);
	choix = query.choix;
	pseudo = query.pseudo;
	gains = 1.5 * mise;
	blackjack = 2 * mise;

	lobby = fs.readFileSync("lobby.json", "UTF-8");
	lobby = JSON.parse(lobby);

	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

	table = fs.readFileSync("tables.json", "UTF-8");
	table = JSON.parse(table);

	//Traitement
	for(let i = 0; i < table[choix].joueurs.length; i++){
				
	}
	

	//Mémorisation du Contexte


	//Fabrication et envoi de la page HTML

	let marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.table = table;

	page = nj.renderString(page,marqueurs);
	
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();
};
module.exports = req_rafraichir;
