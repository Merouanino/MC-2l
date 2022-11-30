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
	let somme = [];
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
		for(let o = 0; o < tables[choix].banque[m].length; o++){
			croupier += Number(fct.valeur(tables[choix].banque[m][o]));
			console.log(croupier);
		}
	}
		
	for(let i = 0; i < tables[choix].joueurs.length; i++){
		if(tables[choix].joueurs[i] !== null){
			for(let j = 0; j < tables[choix].main[i].length; j++){
				somme[i] += Number(fct.valeur(tables[choix].main[i][j]));
				console.log(somme);
				
			}
		}
	}
	
	
	//Le joueur qui a la main

	for(let l = 0; l < tables[choix].actif; l++){
		marqueurs.actif = tables[choix].actif;
		marqueurs.mains = tables[choix].main[l];
	}
	
	//Les cartes de la banque

	if (croupier < 17 && tables[choix].actif == tables[choix].joueurs.length ){
		tables[choix].banque.push(fct.valeur());
	}

	//Les conditions de victoire
	
	//recup l'indice du joueur dans membres.json
	for(let n = 0; n < membres.length; i++){
			if(membres[n].pseudo === pseudo){
				indice = n;
			}
		}
	
	//recup l'indice du joueur qui se trouve dans tables.json (meme indice que pour la mise)
	indice_pseudo = tables[choix].joueurs.indexOf(indice);

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

	tables = JSON.stringify(tables, null, "\t");
	fs.writeFileSync("tables.json", tables, "utf-8");

	membres = JSON.stringify(membres, null, "\t");
	fs.writeFileSync("membres.json", membres, "UTF-8");
	
	//Fabrication et envoi de la page HTML

	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	//marqueurs.actif = tables[choix].actif === query.pseudo;
	page = nj.renderString(page,marqueurs);
	
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();

};

module.exports = req_rafraichir;
