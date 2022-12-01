/* eslint-disable indent */
//La requête qui gère la progression du jeu dans la table
"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require('url');
const fct = require("./fct_initialisation.js");

const req_rafraichir = function (req,res,query){
	
	let page = fs.readFileSync(`modele_plateau.html`, "UTF-8");
	let contenu;
	let requete;
	let pathname;
	let choix;
	let pseudo;
	let lobby;
	let membres;
	let tables;
	let resultat;
	let somme = [0,0,0,0,0];
	let gains;
	let mise;
	let croupier = 0;
	let blackjack;
	let actif;
	let marqueurs = {};
	let indice;
	let indice_pseudo;
	let gain;
	let i;
	let pseudo_actif = [];

	//Récupération du Contexte

	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(lobby);

	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);

	//mise = tables[choix].mises;
	choix = query.choix;
	pseudo = query.pseudo;
	
	//Traitement
	
	//Calcul des mains
	
	for(let m = 0; m < tables[choix].banque.length; m++){
		croupier += Number(fct.valeur(tables[choix].banque[m]));
		console.log("1", croupier);
	}
		
	for(let i = 0; i < tables[choix].joueurs.length; i++){
		if(tables[choix].joueurs[i] !== null){
			for(let j = 0; j < tables[choix].main[i].length; j++){
				somme[i] += Number(fct.valeur(tables[choix].main[i][j]));
			console.log("2", somme);
			}
		}
	}
	
	
	//Le joueur qui a la main

	marqueurs.actif = tables[choix].actif;
	marqueurs.mains = tables[choix].main;
	
	//Les cartes de la banque

	if (croupier < 17 && tables[choix].actif == tables[choix].joueurs.length ){
		tables[choix].banque.push(fct.valeur());
	}

	//Le tour de la banque
	// if(tables[choix].actif == 0 && tables[choix].joueurs.length > 1){
    if(tables[choix].joueurs.filter(el => el === null).length === 5 - tables[choix].actif){
		while(croupier < 17){
			tables[choix].banque.push(fct.cartes());
		}
	}
	
	//recup l'indice du joueur dans membres.json
	marqueurs.actif = membres[tables[choix].joueurs[tables[choix].actif]].pseudo === query.pseudo;
	console.log(marqueurs.actif = membres[tables[choix].joueurs[tables[choix].actif]].pseudo === query.pseudo);

	//recup la valeur de la mise du joueur 
	gain = tables[choix].mises[indice_pseudo];


	//verification
	if(somme === 21){
		if(croupier === 21){
			membres[indice].coins += gain;
		}else{
			membres[indice].coins += gain * 2;
		}
	}else if(somme < 21){
		if(croupier > 21 || (croupier < 21 && croupier < somme)){
			membres[indice].coins += gain * 2;
		}else if(croupier === somme){
			membres[indice].coins += gain;
		}
	}
	
	//Mémorisation du Contexte

	contenu = JSON.stringify(tables, null, "\t");
	fs.writeFileSync("tables.json", contenu, "utf-8");

	contenu = JSON.stringify(membres, null, "\t");
	fs.writeFileSync("membres.json", contenu, "UTF-8");
	
	//Fabrication et envoi de la page HTML

	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.mise = mise;
	marqueurs.banque = tables[choix].banque;
	page = nj.renderString(page,marqueurs);
	
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();

};

module.exports = req_rafraichir;
