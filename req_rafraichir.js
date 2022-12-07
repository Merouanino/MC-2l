/* eslint-disable indent */
//La requête qui gère la progression du jeu dans la table
"use strict";
const fs = require("fs");
const nj = require("nunjucks");
const url = require('url');
const fct = require("./fct_initialisation.js");

const req_rafraichir = function (req,res,query){
	
	let lobby;
	let membres;
	let tables;
	let choix;
	let pseudo;
	let croupier = 0;
	let somme = [0,0,0,0,0];
	let indice;
	let id_joueur;
	let banque_etat;
	let gain;
	let contenu;
	let marqueurs = {};
	let page;
	
	let mise;

	//Récupération du Contexte

	lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(lobby);

	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);

	choix = query.choix;
	pseudo = query.pseudo;
	
	//Traitement
	//Calcul des mains
	croupier = fct.calculbanque(tables[choix].banque);
		
	for(let i = 0; i < tables[choix].joueurs.length; i++){
		somme[i] = fct.calculbanque(tables[choix].main[i]);
	}
	
	//recup l'indice du joueur dans membres.json
    for(let i = 0; i < membres.length ; i++){
        if(membres[i].pseudo === pseudo){
            indice = i;
        }
    }

    //Recup l'indice du joueur dans la liste des joueurs du fichier tables.json
    id_joueur = tables[choix].joueurs.indexOf(indice);

	//Le tour de la banque
	let banque_actif = tables[choix].joueurs.length === tables[choix].actif;
    
	if(banque_actif){
		while(fct.calculbanque(tables[choix].banque) < 17){
			tables[choix].banque.push(fct.carte(tables[choix].cartes));
		}
		banque_etat = true;
		tables[choix].etat = false;
		lobby[choix].etape = 0;
	}
	//recup la valeur de la mise du joueur 
	gain = tables[choix].mises[id_joueur];
	
	//verification

	if(banque_actif && tables[choix].compter === true){
		if(somme[id_joueur] === 21){
			if(croupier === 21){
				membres[indice].coins += gain;
				tables[choix].compter = false;
			}else{
				membres[indice].coins += gain * 2;
				tables[choix].compter = false;
			}
		}else if(somme[id_joueur] < 21){
			if(croupier > 21 || (croupier < 21 && croupier < somme[id_joueur])){
				membres[indice].coins += gain * 2;
				tables[choix].compter = false;
			}else if(croupier === somme[id_joueur]){
				membres[indice].coins += gain;
				tables[choix].compter = false;
			} else {
				console.log("2e else", croupier, somme[id_joueur]);
			}
		} else {
			console.log("1er else", croupier, somme[id_joueur]);
		}
	}

	//Mémorisation du Contexte

	contenu = JSON.stringify(tables, null, "\t");
	fs.writeFileSync("tables.json", contenu, "utf-8");

	contenu = JSON.stringify(membres, null, "\t");
	fs.writeFileSync("membres.json", contenu, "UTF-8");
	
	//Fabrication et envoi de la page HTML

	if(banque_actif){
		marqueurs.actif = false;
		console.log("banque active");
	}else{
		marqueurs.actif = membres[tables[choix].joueurs[tables[choix].actif]].pseudo === pseudo;
		console.log("pseudo : " + pseudo + " + marqueurs.actif : " + marqueurs.actif);
	}

	if(banque_etat === true){
		marqueurs.fin = true;
	}
	
	lobby[choix].etape = 0;
	
	contenu = JSON.stringify(lobby, null, "\t");
    fs.writeFileSync("lobbys.json", contenu, "UTF-8");
	
	marqueurs.banque_actif = banque_actif;
	marqueurs.pseudo = pseudo;
	marqueurs.choix = choix;
	marqueurs.mise = mise;
	marqueurs.banque = tables[choix].banque;
	// marqueurs.actif = tables[choix].actif;
	marqueurs.mains = tables[choix].main;
	
	page = fs.readFileSync(`modele_plateau.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);
	
	res.writeHead(200,{ 'Content-Type' : 'text/html' });
	res.write(page);
	res.end();
};
module.exports = req_rafraichir;
