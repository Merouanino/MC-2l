// Site WEB demo PI

"use strict";
const http = require("http");
const url = require("url");
let mon_serveur;
let port;
const fs = require("fs");

// Vérification de l'existence des tables et des lobbys
//https://nodejs.org/dist/latest-v18.x/docs/api/fs.html#fsaccesssyncpath-mode

try{
	fs.accessSync("tables.json", fs.constants.R_OK);
} catch (err) {
	if (err.code === "ENOENT"){
		fs.writeFileSync("tables.json", JSON.stringify([
			{"joueurs" : [],"etat" : true, "mises" : [], "cartes" : [], "main" : [[], [], [], [], []]},
			{"joueurs" : [],"etat" : true, "mises" : [], "cartes" : [], "main" : [[], [],     [], [], []]},
			{"joueurs" : [],"etat" : true, "mises" : [], "cartes" : [], "main" : [[], [],     [], [], []]}
		]), "UTF-8");
	}
}
try{
	fs.accessSync("lobbys.json", fs.constants.R_OK);
} catch (err) {
	if (err.code === "ENOENT"){
	fs.writeFileSync("lobbys.json", JSON.stringify([
		{"joueurs" : [],"choix" : [0], "min" : 20},
		{"joueurs" : [],"choix" : [1], "min" : 50},
		{"joueurs" : [],"choix" : [2], "min" : 100}
	]), "UTF-8");
	}
}

// DECLARATION DES DIFFERENTS MODULES CORRESPONDANT A CHAQUE ACTION

const req_commencer = require("./req_commencer.js");
const req_afficher_formulaire_inscription = require("./req_afficher_formulaire_inscription.js");
const req_inscrire = require("./req_inscrire.js");
const req_identifier = require("./req_identifier.js");
const req_rejoindre = require("./req_rejoindre.js");
const req_quitter_lobby = require("./req_quitter_lobby");
const req_actualiser_lobby = require("./req_actualiser_lobby");
const req_actualiser_lobby_plateau = require("./req_actualiser_lobby_plateau");
const req_miser = require("./req_miser.js");
const req_rafraichir = require("./req_rafraichir.js");
const req_ejecter = require("./req_ejecter.js");
const req_quitter = require("./req_quitter.js");
const req_continuer = require("./req_continuer.js");
const req_statique = require("./req_statique.js");
const req_erreur = require("./req_erreur.js");

// FONCTION DE CALLBACK APPELLEE POUR CHAQUE REQUETE

const traite_requete = function (req, res) {

	let requete;
	let pathname;
	let query;

	console.log("URL reçue : " + req.url);
	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	// ROUTEUR

	try {
		switch (pathname) {
			case '/':
			case '/req_commencer':
				req_commencer(req, res, query);
				break;
			case '/req_afficher_formulaire_inscription':
				req_afficher_formulaire_inscription(req, res, query);
				break;
			case '/req_inscrire':
				req_inscrire(req, res, query);
				break;
			case '/req_identifier':
				req_identifier(req, res, query);
				break;
			case '/req_rejoindre' : 
				req_rejoindre(req,res,query);
				break;
			case '/req_actualiser_lobby' : 
				req_actualiser_lobby(req,res,query);
				break;
			case '/req_quitter_lobby' :
				req_quitter_lobby(req,res,query);
				break;
			case '/req_miser' :
				req_miser(req,res,query);
				break;
			case '/req_ejecter' :
                req_ejecter(req,res,query);
                break;
		   case '/req_quitter' :
				req_quitter(req,res,query);
				break;
		   case '/req_continuer' :
				req_continuer(req,res,query);
				break;
		   case '/req_actualiser_lobby_plateau' :
				req_actualiser_lobby_plateau(req,res,query);
				break;
			default:
				req_statique(req, res, query);
				break;
		}
	} catch (e) {
		console.log('Erreur : ' + e.stack);
		console.log('Erreur : ' + e.message);
		// console.trace();
		req_erreur(req, res, query);
	}
};

// CREATION ET LANCEMENT DU SERVEUR

mon_serveur = http.createServer(traite_requete);
port = 8080;
// Pour récupérer le numéro du port depuis la ligne de commande. Exemple : node index.js 5000
// port = process.argv[2];
console.log("Serveur en ecoute sur port " + port);
mon_serveur.listen(port);
