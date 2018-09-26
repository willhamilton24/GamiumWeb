const request = require('request');
const mongoose = require('mongoose')
const Nightmare = require('nightmare');
nightmare = Nightmare();

// Dev Server
var apiOptions = {
	server : "http://192.168.1.87:3000"
}

// Production Server
if (process.env.NODE_ENV === 'production') {
	// apiOptions.server = Heroku Server
}


let renderHomepage = function(req, res, featuredGame) {
	res.render('index', {
		title: "Gamium"
	});
}

let renderSearchResults = function(req, res, results) {
	res.render('search', {
		title: "Gamium",
		searchResults: results
	});
}

let renderGame = function(req, res, game, steamPrice) {
	res.render('game', {
		title: game.name,
		gameInfo: {
			name: game.name,
			dev: game.dev,
			publisher: game.publisher,
			desc: game.description,
			img: game.img,
			releaseDate: game.rDate,
			goglink: game.goglink,
			id: game.appid
		},
		steam : steamPrice
	});
}


// GET Home Page
module.exports.homepage = function(req, res) {
	renderHomepage(req, res);

}

// Search Redirect
module.exports.sRedirect = function(req,res) {
	console.log("Redirecting...");
	res.redirect("http://192.168.1.87:3000/search/" + encodeURIComponent(req.body.search));
}

// GET Search Results
module.exports.search = function(req, res) {
	let path = '/api/s/' + req.params.query;
	let requestOptions = {
		url: apiOptions.server + path, 
		method: "GET", 
		json: {}
	};

	request(requestOptions, function(err, response, body) {
		if (err) throw err;
		renderSearchResults(req, res, body);
	});


}

// GET Game
module.exports.game = function(req, res) {

	var path = '/api/games/' + req.params.appid;
	var requestOptions = {
		url: apiOptions.server + path, 
		method: "GET", 
		json: {}
	};

	request(requestOptions, function(err, response, body) {
		if (req.params.appid.length < 10) {
			request({ url: 'http://store.steampowered.com/api/appdetails?appids=' + req.params.appid , method: "GET", json: {} }, function(err, response, steamBody) {
				if (steamBody[req.params.appid].data) { renderGame(req, res, body, "$" + steamBody[req.params.appid].data.price_overview.final / 100); } });
		} else {
			renderGame(req, res, body, "Not Sold Here")
		}
	});
	
	//console.log(sp);
	
}