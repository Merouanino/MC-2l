"use strict";
const { table } = require("console");
const fs = require("fs");
const nj = require("nunjucks");
const url = require("url");
const fct = require("./fct_initialisation.js");
const req_prendre = function (req,res,query){
	let page;
	let contenu;
	let requete;
	let pathname;
	let pseudo;
	let choix;
	let marqueurs;
	let tables;
	let carte_random;
	let cartes;
	let actif;

	//Récupération du Contexte
	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	pseudo = query.pseudo;
	choix = query.choix;

	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);
	actif = tables[choix].actif;
	page = fs.readFileSync("modele_plateau.html", "utf-8");

	//Traitement

	console.log(actif);

	//for(let i = 0; i < tables[choix].joueurs.length; i++){
	carte_random = fct.carte();
	tables[choix].cartes.splice(tables[choix].cartes.indexOf(carte_random), 1);
	if(tables[choix].joueurs[actif] !== null ){
		tables[choix].main[actif].push(carte_random);	
	}
	//}

	if(tables[choix].cartes.length < 3 * 52 ){
		let paquet = fct.carteInit();
		tables[choix].cartes = paquet;
	}
	

	//Mémorisation du Contexte
	contenu = JSON.stringify(tables);
	fs.writeFileSync("tables.json", contenu, "utf-8");


	//Fabrication et envoi de la page HTML
	marqueurs = {};
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
