const mongoose = require('mongoose');
const Nightmare = require('nightmare');
const https = require('https');

var G = mongoose.model('game');

//class Nightmare {
//	static getNewNightmare() {
//		return initNightmare();
//	}
//}

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
}

module.exports.readOneGame = function(req,res) {
	if(req.params && req.params.appid) {
		G.findOne({'appid' : req.params.appid})
			.exec(function(err, game) {
				if(!game) {
					sendJsonResponse(res, 404, {
						"message": "game id not found"
					});
					return;
				} else if(err) {
					sendJsonResponse(res, 404, err)
					return;
				}
				sendJsonResponse(res, 200, game);
			});
	} else {
		sendJsonResponse(res, 404, {
			"message" : "No appid in request"
		});
	}
}

module.exports.readOneGameByName = function(req,res) {
	if(req.params && req.params.name) {
		console.log(req.params.name.replace(/shpashe/g, ' '));
		G.findOne({'name' : req.params.name.replace(/shpashe/g, ' ')})
			.exec(function(err, game) {
				if(!game) {
					sendJsonResponse(res, 404, {
						"message": "game not found"
					});
					return;
				} else if(err) {
					sendJsonResponse(res, 404, err)
					return;
				}
				sendJsonResponse(res, 200, game);
			}); 
	} else {
		sendJsonResponse(res, 404, {
			"message" : "No name in request"
		});
	}
}

module.exports.getSearchResults = function(req, res) {
	if(req.params && req.params.query) {
		let translatedSearchTerm = decodeURIComponent(req.params.query);
		G.find(
			{ $text : {$search : translatedSearchTerm} },
			{ score : {$meta : 'textScore'} }
		).sort({ score: {$meta : 'textScore'} }).exec(function(err, results) {
			if (err) throw err;
			sendJsonResponse(res, 200, results);
		})
	}
}

module.exports.getGOGPrice = function(req,res) {
	if(req.params && req.params.appid) {
		G.findOne({'appid' : req.params.appid})
			.exec(function(err, game) {
				if (err) { throw err };
				console.log(game.name)
				if(!game) {
					sendJsonResponse(res, 404, {
						"message": "game id not found"
					});
					return;
				} else if(err) {
					sendJsonResponse(res, 404, err)
					return;
				}
				console.log('Scrapeing...');
				https.get(game["gog-price"].replace("{country}", "US"), (resp) => {
					let data = '';

					resp.on('data', (chunk) => {
						data += chunk;
					});

					resp.on('end', () => {
						price = JSON.parse(data)._embedded.price.finalPrice;
						p1 = price.substring(price.length - 1);
						p2 = price.substring(0, price.length - 2);
						return "$" + p1 + "." + p2;
					});
				}).on('error', (err) => {
					return "ERROR: " + err.message;
				});
				
				}).end().then(function(result) {
					sendJsonResponse(res, 200, result);
				});
	} else {
		sendJsonResponse(res, 404, {
			"message" : "No appid in request"
		});
	}
	
}