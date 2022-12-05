"use strict";

const fs = require("fs");
const nj = require("nunjucks");;
const url = require('url');

const req_quitter = function (req, res, query) {
	let requete;
	let pathname;
	let marqueurs;
	let page;
	let tables;
	let pseudo;
	let joueur;
	let choix;
	let members;
	let coins;
	let contenu;
	let indice;

	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;
	
	pseudo = query.pseudo;
	choix = query.choix;

	//Lecture du fichier json 
		
	members = fs.readFileSync("membres.json", "UTF-8");
	members = JSON.parse(members);

	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);
	
	// On cherche le nombre de crédits
    for(let i = 0; i < members.length; i++){
        if(members[i].pseudo === pseudo){
            coins = members[i].coins;
        }
    }

	//recup l'indice du joueur dans membre
	for (let i = 0; i < members.length; i++){
        if(members[i].pseudo === pseudo){
            coins = members[i].coins;
			indice = i;
        }
    }
	

	//récupération du pseudo depuis url et trouve l'indice du joueur dans le tableau joueur
	


	//initialisation des cartes du joueur et de la banque
	for(let j = 0; j < tables[choix].main.length; j++){
        tables[choix].main[j] = [];
    }
	

	//initialisation de la liste des mises
    for(let j = 0; j < 4; j++){
        tables[choix].mises.splice(0, 1);
    }

	//supprétion du joueur ayant quitter la table
	for(let j = 0; j < tables[choix].joueurs.length; j++){	
	joueur = tables[choix].joueurs.indexOf(indice);
		tables[choix].joueurs.splice(joueur, 1);
	}

/*
	for(let j = 0; j < tables[choix].joueurs.length; j++){	
		if(tables[choix].joueurs.includes(indice)){
			joueur = tables[choix].joueurs.indexOf(indice);
			tables[choix].joueurs.splice(joueur, 1);
			page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");
        }else{
			page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");
        }
	}
*/

	tables[choix].banque = [];
    tables[choix].actif = 0;
	tables[choix].etat = true;

	
	contenu = JSON.stringify(tables);
	contenu = fs.writeFileSync("tables.json", contenu, 'utf-8');
	
	page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");
	
	marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.credits = coins;
	
	page = nj.renderString(page,marqueurs);
    
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_quitter;

