"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");;

const trait = function (req, res, query) {
	let requete;
	let pathname;
	let query;
    let marqueurs;
	let page;
    let lobby;
	let fichier;
	//let membres;
	let pseudo;
	let i;
	let tables;
	let joueur;
	let joueur_attente;

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;

	//lecture des fichiers json

	lobby = fs.readFileSync("lobby.json", "UTF-8");
    lobby = JSON.parse(lobby);
	
	//membres = fs.readFileSync("membres.json", "UTF-8");
    //membres = JSON.parse(membres);

	tables = fs.readFileSync("tables.json", "UTF-8");
    tables = JSON.parse(tables);
	
	//Récupérarion de l'indice du pseudo et suppression dans la liste qd on appuie sur "quitter"

	pseudo = query.pseudo;
	pseudo = lobby.indexOf(pseudo);

	if(query.bouton === 'Quitter'){
		lobby.splice(pseudo, 1);
        lobby = JSON.stringify(lobby);
        lobby = fs.writeFileSync("lobby.json", lobby, 'utf-8');
	}

/*
	//html += `< img src ="` +situation[id]+ `.png">`;
    marqueurs = {};
	marqueurs[""] = "";
*/
	joueur = tables.joueurs;
	joueur_attente = lobby.joueurs;

	if(){
		for(i = joueur.length; i < 4; i ++){
			joueur.push(joueur_attente[0]);
			joueur_attente.splice(0, 1);
		}
	}

	page = nunjucks.renderString(page, marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = trait;

