"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");
const url = require("url");
const fct = require("./fct_initialisation.js");

const actualiser_lobby_plateau = function (req, res, query) {
	let contenu;
	let lobby;
	let membres;
	let tables;
	let choix;
	let pseudo;
	let mise;
	let joueur;
	let joueur_mise;
	let marqueurs;
	let page;
	let requete;
	let pathname;
	let cartes;

	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;
	
	//Récupération du contexte
	
	contenu = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(contenu);
	
	contenu = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(contenu);
	
	contenu = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(contenu);
	
	choix = query.choix;
	pseudo = query.pseudo;
	cartes = tables[choix].main;

	//Vérifie que les joueurs sont là et récupère leur mise, si ts les joueurs du tab sont là on les envoit vers le plateau
	joueur_mise = tables[choix].mises.filter(el2 => el2 === null);
	
	//rajouter mise dans json
	if(joueur_mise.length === 0){
	
		//Initialisation des cartes
    	if(tables[choix].cartes.length === 0){ 
    		let paquet = fct.carteInit();
    		tables[choix].cartes = paquet;
		}
    
		//Distribution des cartes 
		console.log(tables[choix].main);
		if(tables[choix].main.length === 0){
			for(let i = 0; i < tables[choix].joueurs.length; i++){
				tables[choix].main.push([
					fct.carte(tables[choix].cartes),
					fct.carte(tables[choix].cartes)
				]);
			}
	
			tables[choix].banque = [fct.carte(tables[choix].cartes),fct.carte(tables[choix].cartes)];
			tables[choix].actif = 0;
		}
		page = fs.readFileSync("modele_plateau.html", "utf-8");
	}else{
		page = fs.readFileSync("modele_lobby_plateau.html", "utf-8");
	}

	//on ne peut plus rejoindre la table car etat = false

	tables[choix].etat = false;
		
	//on enregistre
	
	contenu = JSON.stringify(tables, null, "\t");
	fs.writeFileSync("tables.json",contenu,"UTF-8");
	
	marqueurs = {};
	marqueurs.banque_actif = tables[choix].joueurs.length === tables[choix].actif;
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.mise = mise;
	marqueurs.mains = cartes;
	marqueurs.banque = tables[choix].banque;
	page = nunjucks.renderString(page, marqueurs);

	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();
};

module.exports = actualiser_lobby_plateau;

