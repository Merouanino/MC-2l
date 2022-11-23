//La requête qui gère la progression du jeu dans la table
"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require('url');
//Concat*6 + sortof(mathrandom - 0,5) 

const req_rafraichir = function (req,res,query){
	
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
	const cartes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
	
	cartes.sort(()=> Math.random()-0.5);
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
		if(membres.pseudo[i] === pseudo && table[choix].etat === true){

		}
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
