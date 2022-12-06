"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");
const url = require("url");

const actualiser_lobby = function (req, res, query) {
	let requete;
	let pathname;
	let choix;
	let contenu;
    let lobby;
	let membres;
	let tables;
	let pseudo;
	let pseudos;
	let continuer;
	let joueur;
	let marqueurs;
	let page;
	let nul;
	let indice;

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;
	
	choix = query.choix;

	//Récupération du contexte
	
	contenu = fs.readFileSync("lobbys.json", "UTF-8");
    lobby = JSON.parse(contenu);
	
	contenu = fs.readFileSync("membres.json", "UTF-8");
    membres = JSON.parse(contenu);
	
	contenu = fs.readFileSync("tables.json", "UTF-8");
    tables = JSON.parse(contenu);

	//Actualiser la liste d'attente avec les pseudo

	pseudo = query.pseudo;
	pseudos = [];

	for (let i = 0; i < membres.length; i++){
          if(membres[i].pseudo === pseudo){
              indice = i;
          }
      }


	for(let i = 0; i < lobby[choix].joueurs.length; i++){
		pseudos.push(membres[indice].pseudo);
//		pseudos.push(membres[lobby[choix].joueurs[i]].pseudo);
	}

	//Vérifier si la table est libre
	
	continuer = tables[choix].etat;

	if(continuer === false){
		tables[choix].joueurs = [];

		while (lobby[choix].joueurs.length > 0 && tables[choix].joueurs.length < 5) {
			tables[choix].joueurs.push(lobby[choix].joueurs[0]);
			lobby[choix].joueurs.splice(0, 1);
		}

		tables[choix].etat = true;
		tables[choix].compter = true;
		tables[choix].mises = [];
		tables[choix].cartes = [];
		tables[choix].main = [];

		for (let j of tables[choix].joueurs) {
			tables[choix].mises.push(null);
		}
	}

	//Mémorisation du Contexte

	contenu = JSON.stringify(tables);
	fs.writeFileSync("tables.json", contenu, "utf-8");

	contenu = JSON.stringify(lobby);
	fs.writeFileSync("lobbys.json", contenu, "utf-8");

	if (tables[choix].joueurs.some(j => membres[j].pseudo === pseudo) && lobby[choix].etape === 1) {
		page = fs.readFileSync("modele_jeu.html", "utf-8");
	}else{
		page = fs.readFileSync("modele_lobby.html", "utf-8");
	}

	marqueurs = {};
	marqueurs["pseudos"] = pseudos;
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.etape = lobby[choix].etape === 0;

	page = nunjucks.renderString(page, marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = actualiser_lobby;

