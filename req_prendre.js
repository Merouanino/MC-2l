"use strict";

const fs = require("fs");
const nj = require("nunjucks");
const url = require("url");
const fct = require("./fct_initialisation.js");

const req_prendre = function (req,res,query){
	let pseudo;
	let choix;
	let tables;
	let actif;
	let carte_random;
	let contenu;
	let page;
	let marqueurs;

	//Récupération du Contexte

	pseudo = query.pseudo;
	choix = query.choix;

	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);
	
	actif = tables[choix].actif;

	//Traitement

	carte_random = fct.carte(tables[choix].cartes);
	tables[choix].main[actif].push(carte_random);	

	if(tables[choix].cartes.length < (3 * 52) ){
		let paquet = fct.carteInit();
		tables[choix].cartes = paquet;
	}

	//Mémorisation du Contexte
	
	contenu = JSON.stringify(tables);
	fs.writeFileSync("tables.json", contenu, "utf-8");

	//Fabrication et envoi de la page HTML
	
	marqueurs = {};
	marqueurs.banque = tables[choix].banque;
	marqueurs.mains = tables[choix].main;
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;

	page = fs.readFileSync(`modele_plateau.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);

	res.writeHead(200, { 'Content-Type' : 'text/html'});
	res.write(page);
	res.end();
};
module.exports = req_prendre;
