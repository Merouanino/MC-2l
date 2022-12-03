/* eslint-disable indent */
//La requête qui gère la progression du jeu dans la table
"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require('url');
const fct = require("./fct_initialisation.js");

const req_rafraichir = function (req,res,query){
	
	let page = fs.readFileSync(`modele_plateau.html`, "UTF-8");
	let contenu;
	let requete;
	let pathname;
	let choix;
	let pseudo;
	let lobby;
	let membres;
	let tables;
	let resultat;
	let somme = [0,0,0,0,0];
	let gains;
	let mise;
	let croupier = 0;
	let blackjack;
	let actif;
	let marqueurs = {};
	let indice;
	let id_joueur;
	let gain;
	let i;
	let pseudo_actif = [];
	let banque_etat;

	//Récupération du Contexte

	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(lobby);

	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);

	//mise = tables[choix].mises;
	choix = query.choix;
	pseudo = query.pseudo;
	
	//Traitement
	
	//Calcul des mains
	for(let m = 0; m < tables[choix].banque.length; m++){
		croupier += Number(fct.valeur(tables[choix].banque[m]));
		console.log("1", croupier);
	}
		
	for(let i = 0; i < tables[choix].joueurs.length; i++){
		if(tables[choix].joueurs[i] !== null){
			for(let j = 0; j < tables[choix].main[i].length; j++){
				somme[i] += Number(fct.valeur(tables[choix].main[i][j]));
			console.log("2", somme);
			}
		}
	}
	
	//Le joueur qui a la main

	marqueurs.actif = tables[choix].actif;
	marqueurs.mains = tables[choix].main;
	
	//recup l'indice du joueur dans membres.json
    for(i = 0; i < membres.length ; i++){
        if(membres[i].pseudo === pseudo){
            indice = i;
        }
    }

    //Recup l'indice du joueur dans la liste des joueurs du fichier tables.json
    id_joueur = tables[choix].joueurs.indexOf(indice);

	//Le tour de la banque
	let banque_actif = 5 - tables[choix].joueurs.filter(el => el === null).length === tables[choix].actif ;
    
	if(banque_actif){
		while(fct.calculbanque(tables[choix].banque) < 17){
			tables[choix].banque.push(fct.carte());
		}
		banque_etat = true;

	}

	if(banque_actif){
		marqueurs.actif = false;
	}else{
		//recup l'indice du joueur dans membres.json
		marqueurs.actif = membres[tables[choix].joueurs[tables[choix].actif]].pseudo === pseudo;
	}

	if(banque_etat === true){
		marqueurs.fin = true;
	}

	//recup la valeur de la mise du joueur 
	gain = tables[choix].mises[id_joueur];
	
	//verification
	console.log(membres[indice].coins);	
	console.log(tables[choix].compter);
	console.log(banque_actif);

	if(banque_actif && tables[choix].compter === true){
		if(somme[id_joueur] === 21){
			if(croupier === 21){
				membres[indice].coins += gain;
				tables[choix].compter = false;
				console.log("gato1");
			}else{
				membres[indice].coins += gain * 2;
				tables[choix].compter = false;
				console.log("gato2");
			}
		}else if(somme[id_joueur] < 21){
			if(croupier > 21 || (croupier < 21 && croupier < somme[id_joueur])){
				membres[indice].coins += gain * 2;
				tables[choix].compter = false;
				console.log("gato3");
			}else if(croupier === somme[id_joueur]){
				membres[indice].coins += gain;
				tables[choix].compter = false;
				console.log("gato4");
			}
		}	
	}

	console.log(membres[1].coins);
	//Mémorisation du Contexte

	contenu = JSON.stringify(tables, null, "\t");
	fs.writeFileSync("tables.json", contenu, "utf-8");

	contenu = JSON.stringify(membres, null, "\t");
	fs.writeFileSync("membres.json", contenu, "UTF-8");
	
	//Fabrication et envoi de la page HTML

	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.mise = mise;
	marqueurs.banque = tables[choix].banque;
	page = nj.renderString(page,marqueurs);
	
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();

};

module.exports = req_rafraichir;
