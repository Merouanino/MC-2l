//La requête qui fait le changement d'état de la table
"use strict"
const fs = require("fs");
const nj = require("nunjucks");
const url = require("url");

const req_passer_lobby = function (req,res,query){
    let page;
    let contenu;
    let requete;
    let pathname;
    let pseudo;
    let choix;
    let marqueurs = {};
	let lobbys;
	let pseudos;
	let membres;

    //Récupération du Contexte

    requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;

    pseudo = query.pseudo;
    choix = query.choix;

	membres = fs.readFileSync("membres.json", "UTF-8");
	membres = JSON.parse(membres);

    lobbys = fs.readFileSync("lobbys.json", "UTF-8");
    lobbys = JSON.parse(lobbys);

    //Traitement

    lobbys[choix].etape = 1;
	pseudos = [];

    for(let i = 0; i < lobbys[choix].joueurs.length; i++){
        pseudos.push(membres[lobbys[choix].joueurs[i]].pseudo);
    }

    //Mémorisation du Contexte

    contenu = JSON.stringify(lobbys);
    fs.writeFileSync("lobbys.json", contenu, "utf-8");

    //Fabrication et envoi de la page HTML
    marqueurs = {};
    marqueurs["pseudos"] = pseudos;
    marqueurs.etape = lobbys[choix].etape === 0;
	marqueurs.pseudo = pseudo;
    marqueurs.choix = choix;
    
	page = fs.readFileSync(`modele_lobby.html`, "UTF-8");
    page = nj.renderString(page,marqueurs);

    res.writeHead(200, { 'Content-Type' : 'text/html'});
    res.write(page);
    res.end();

};
module.exports = req_passer_lobby;

