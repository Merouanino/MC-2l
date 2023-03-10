//La requête qui fait le changement d'état de la table
"use strict"
const fs = require("fs");
const nj = require("nunjucks");
const url = require("url");

const req_passer_lobby = function (req,res,query){
    let pseudo;
    let choix;
	let tables;
	let membres;
	let lobbys;
	let continuer;
    let contenu;
    let marqueurs = {};
    let page;

    //Récupération du Contexte

    pseudo = query.pseudo;
    choix = query.choix;

	tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);
	
	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

    lobbys = fs.readFileSync("lobbys.json", "UTF-8");
    lobbys = JSON.parse(lobbys);

    //Traitement

    lobbys[choix].etape = 1;

	//Vérifier si la table est libre
    
	continuer = tables[choix].etat;

    if(continuer === false){
        tables[choix].joueurs = []; 
        while (lobbys[choix].joueurs.length > 0 && tables[choix].joueurs.length < 5) {
            tables[choix].joueurs.push(lobbys[choix].joueurs[0]);
            lobbys[choix].joueurs.splice(0, 1); 
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

    contenu = JSON.stringify(lobbys);
    fs.writeFileSync("lobbys.json", contenu, "utf-8");
    
	//Fabrication et envoi de la page HTML
    
	marqueurs = {};
	marqueurs.pseudo = pseudo;
    marqueurs.choix = choix;
    marqueurs.etape = lobbys[choix].etape === 0;
    
	page = fs.readFileSync(`modele_jeu.html`, "UTF-8");
    page = nj.renderString(page,marqueurs);

    res.writeHead(200, { 'Content-Type' : 'text/html'});
    res.write(page);
    res.end();
};
module.exports = req_passer_lobby;

