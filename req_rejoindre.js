//La requête qui permet de rejoindre la table choisie
"use strict";
const fs = require("fs");
const nj = require("nunjucks");

const req_rejoindre = function (req,res,query){
	let page = fs.readFileSync(`lobby.html`, "UTF-8");	
	let contenu;
	//Récupération du Contexte
	contenu = ("tables.json", "UTF-8");
	//Traitement

	//Mémorisation du Contexte


	//Fabrication et envoi de la page HTML
	let marqueurs = {};
	marqueurs["liste"] = liste;
	page = nj.renderStrinf(page,marqueurs);
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_rejoindre;

