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
	let somme = 0;
	let gains;
	let mise;
	let blackjack;
	let actif;

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

	for(let i = 0; i < tables[choix].joueurs.length; i++){
		if(tables[choix].joueurs[i] !== null){
			for(let j = 0; j < tables[choix].main[i].length; j++){
				somme += Number(fct.valeur(tables[choix].main[i][j]));
				console.log(somme);
			}
		}
	}
	
	//Le joueur actif 

	for(let k = 0; k < tables[choix].joueurs.length; k++){
		if(tables[choix].joueurs[k] !== null){
			tables[choix].actif.push(k);
		}
	}

	//Mémorisation du Contexte

	tables = JSON.stringify(tables, null, "\t");
	fs.writeFileSync("tables.json", tables, "utf-8");

	//Fabrication et envoi de la page HTML

	let marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	//marqueurs.actif = tables[choix].actif === query.pseudo;
	page = nj.renderString(page,marqueurs);
	
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_rafraichir;
