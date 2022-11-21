//La requête qui gère la progression du jeu dans la table
"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require('url');

const req_rafraichir = function (req,res,query);{
	
	let page = read.FileSync(`modele_plateau.html`, "UTF-8");
	let contenu;
	let requete;
	let pathname;
	let choix;
	let pseudo;
	let lobby;
	let membres;
	let table;

	//Récupération du Contexte

	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	choix = query.choix;
	pseudo = query.choix

	lobby = fs.readFileSync("lobby.json", "UTF-8");
	lobby = JSON.parse(lobby);

	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

	table = fs.readFileSync("tables.json", "UTF-8");
	table = JSON.parse(table);

	//Traitement
	
	

	//Mémorisation du Contexte


	//Fabrication et envoi de la page HTML

	let marqueurs = {};
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.table = table;

	page = nj.renderString(page,marqueurs);
	
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();
};
module.exports = req_rafraichir;
