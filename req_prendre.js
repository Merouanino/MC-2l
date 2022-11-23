"use strict"
const fs = require("fs");
const nj = require("nunjucks");
const url = require("url");

const req_prendre = function (req,res,query){
    let page;
    let contenu;
	let requete;
	let pathname;
	let pseudo;
    let lobby;
	let membres;
    let cartes;


    //Récupération du Contexte
    requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query

    pseudo = query.pseudo;
    
    lobby = fs.readFileSync("lobbys.json", "UTF-8");
	lobby = JSON.parse(lobby);
}
