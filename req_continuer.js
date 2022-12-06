"use strict";

const fs = require("fs");
const nj = require("nunjucks");;
const url = require('url');

const req_continuer = function (req, res, query) {
	let requete;
	let pathname;
	let pseudo;
	let contenu;
	let membres;
	let coins;
	let tables;
	let page;
    let marqueurs;
	let choix;
	let indice;
	let lobbys;

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;


	//Récupération des crédits associés au compte
	
	pseudo = query.pseudo;
	choix = query.choix;

	//Lecture du fichier json 
	
	contenu = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(contenu);
	
	contenu = fs.readFileSync("lobbys.json", "UTF-8");
	lobbys = JSON.parse(contenu);

	for (let i = 0; i < membres.length; i++){
		if(membres[i].pseudo === pseudo){
			indice = i;
		}
	}

	lobbys[choix].joueurs.push(indice);

	let pseudos = []; 
    
	for (let j = 0; j < lobbys[choix].joueurs.length; j++){
		pseudos.push(membres[indice].pseudo);

        //pseudos.push(membres[lobby[choix].joueurs[j]].pseudo);
	}


	//on enregistre

	contenu = JSON.stringify(lobbys);
	fs.writeFileSync("lobbys.json", contenu, "UTF-8");

	page = fs.readFileSync(`modele_lobby.html`, "UTF-8");

	marqueurs = {};
	marqueurs["pseudos"] = pseudos;
	marqueurs.etape = lobbys[choix].etape === 0;
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.credits = coins;
	
	page = nj.renderString(page,marqueurs);
    
	res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = req_continuer;

