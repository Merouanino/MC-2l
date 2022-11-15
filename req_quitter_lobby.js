"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");;

const req_quitter_lobby = function (req, res, query) {
	let requete;
	let pathname;
    let marqueurs;
	let page;
    let lobby;
	let pseudo;

	requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;

	//Lecture du fichier json 
	lobby = fs.readFileSync("lobby.json", "UTF-8");
    lobby = JSON.parse(lobby)
	
	//supprétion du joueur ayant quitter le lobby
	lobby.splice(pseudo, 1);
	lobby = JSON.stringify(lobby);
	lobby = fs.writeFileSync("lobby.json", lobby, 'utf-8');

	//page = nunjucks.renderString(page, marqueurs);
	page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = req_quitter_lobby;

