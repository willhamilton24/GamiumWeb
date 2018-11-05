const mongoose = require('mongoose');
const Nightmare = require('nightmare');

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
				let nightmare = Nightmare();
				nightmare.goto(game.goglink).wait(2000).evaluate(function() {
					gogPrice = document.getElementsByClassName("product-actions-price__final-amount")[0].innerHTML;
					return "$" + gogPrice;
				}).end().then(function(result) {
					sendJsonResponse(res, 200, result);
				});
			});
	} else {
		sendJsonResponse(res, 404, {
			"message" : "No appid in request"
		});
	}
	
}