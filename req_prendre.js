"use strict"
const { table } = require("console");
const fs = require("fs");
const nj = require("nunjucks");
const url = require("url");

const req_prendre = function (req,res,query){
    let page;
    let contenu;
	let requete;
	let pathname;
	let pseudo;
    let carte;
    let choix;
    let marqueurs;
    //Récupération du Contexte
    requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query

    pseudo = query.pseudo;
    choix = query.choix;

    tables = fs.readFileSync("tables.json", "UTF-8");
	tables = JSON.parse(tables);
    page = fs.readFileSync("modele_plateau.html", "utf-8")

    //Traitement

    carte_random = Math.floor(Math.random() * 52)+1;
    tables[choix].cartes.splice(carte_random, 1);

    if(tables[choix].cartes.length < 3*52){

    }
    

    //Mémorisation du Contexte
    contenu = JSON.stringify("table.json");
    fs.writeFileSync("tables.json", contenu,"utf-8")


    //Fabrication et envoi de la page HTML
    marqueurs = {};
    marqueurs.carte = carte_random;

    page = fs.readFileSync(`modele_plateau.html`, "UTF-8");
	page = nj.renderString(page,marqueurs);

    res.writeHead(200, { 'Content-Type' : 'text/html'});
	res.write(page);
	res.end();
  
};
module.exports = req_prendre;
