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
		console.log(req.params.appid);
		console.log(req.params.appid.type);
		G.findOne({"appid" : "'" + req.params.appid.toString() + "'"})
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
		console.log(decodeURIComponent(req.params.name));
		G.findOne({'name' : decodeURIComponent(req.params.name)})
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
		

		var findGame = new Promise(function(resolve, reject) {
			var price;
			G.findOne({'appid' : req.params.appid}, function(err, game) {
				if (err) { throw err };
				//console.log(game.name)
				if(!game) {
					sendJsonResponse(res, 404, {
						"message": "game id not found"
					});
					return;
				} else if(err) {
					sendJsonResponse(res, 404, err)
					return;
				}
				game = JSON.parse(JSON.stringify(game));
				https.get(game.gogprice.replace("{country}", "US"), (resp) => {
					let data = '';

					resp.on('data', (chunk) => {
						data += chunk;
					});

					resp.on('end', () => {
						console.log(JSON.parse(data)._embedded.prices);
						price = JSON.parse(data)._embedded.prices[0].finalPrice.replace(' USD', '');
						var p1 = price.substring(0, price.length - 2);
						var p2 = price.substring(price.length - 2);
						price = "$" + p1 + "." + p2
						console.log(price);
						resolve(price);
					});
				}).on('error', (err) => {
					return "ERROR: " + err.message;
				});
				
				
			})
		});

		findGame.then((result) => {
			sendJsonResponse(res, 200, result);
		});
	} else {
		sendJsonResponse(res, 404, {
			"message" : "No appid in request"
		});
	}	
}