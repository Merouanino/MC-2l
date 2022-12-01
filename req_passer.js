"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require("url");
const fct = require("./fct_initialisation.js");

const req_passer = function (req,res,query){
	let page;
	let contenu;
	let requete;
	let pathname;
	let pseudo;
	let choix;
	let marqueurs = {};
	let tables;

	//Récupération du Contexte

	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	pseudo = query.pseudo;
	choix = query.choix;

	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);
	
	page = fs.readFileSync("modele_plateau.html", "utf-8");

	//Traitement
	
	tables[choix].actif += 1;

	//Mémorisation du Contexte

	contenu = JSON.stringify(tables);
	fs.writeFileSync("tables.json", contenu, "utf-8");

	//Fabrication et envoi de la page HTML
	marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.banque = tables[choix].banque;
	marqueurs.actif = tables[choix].actif;
	marqueurs.mains = tables[choix].main;

	page = fs.readFileSync(`modele_plateau.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);

	res.writeHead(200, { 'Content-Type' : 'text/html'});
	res.write(page);
	res.end();

};  
module.exports = req_passer;


