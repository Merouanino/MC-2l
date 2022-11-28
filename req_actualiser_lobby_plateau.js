"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");
const url = require("url");

const actualiser_lobby_plateau = function (req, res, query) {
	let requete;
	let pathname;
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

    //Initialisation du paquet de cartes 
    const cartes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
    function carte(c){
		return Math.floor(Math.random() * 52);
	};

	function couleur(c){
		return 
	};
    
	function valeur(c){
		let v;
		if(c >= 10){
			v = 10;
		}
		else{
			v = c;
		}
		return v;
	};

	cartes = cartes.concat(cartes);
    cartes = cartes.concat(cartes);
    cartes = cartes.concat(cartes);
    cartes = cartes.concat(cartes);
    cartes = cartes.concat(cartes);

    cartes.sort(()=> Math.random()-0.5);

	//Vérifie que les joueurs sont là et récupère leur mise, si ts les joueurs du tab sont là on les envoit vers le plateau

	joueur = tables[choix].joueurs;
	joueur_mise = tables[choix].mises;
	
	//rajouter mise dans json
	if(joueur.length === joueur_mise.length){
		page = fs.readFileSync("modele_plateau.html", "utf-8");
	}else{
		page = fs.readFileSync("modele_lobby_plateau.html", "utf-8");
	}

	//on ne peut plus rejoindre la table car etat = false

	tables[choix].etat = false;

	//on enregistre
	
	contenu = fs.readFileSync("tables.json", "UTF-8");
    tables = JSON.parse(contenu);

	marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.mise = mise;

	page = nunjucks.renderString(page, marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = actualiser_lobby_plateau;

