"use strict";

//const timer = require("./timer.js");
const fs = require("fs");
const nj = require("nunjucks");
const url = require('url');

const req_ejecter = function(req, res, query){
	let requete;
    let pathname;
    let marqueurs;
    let page;
	let time = 20;

	/*setInterval(() =>{
        time--;
		console.log(time);
    },1000);
*/
    	//si le timer est a 0, on ejecte le joueur dans la page accueil membre
	if(time === 0){
		page = fs.readFileSync(`modele_accueil_membre.html`, "UTF-8");
	}

	marqueurs = {};
    marqueurs.time = time;
		
	page = nj.renderString(page,marqueurs);

	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();
};

module.exports = req_ejecter;

	
