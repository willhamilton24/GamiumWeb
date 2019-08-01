const mongoose = require('mongoose');
const Nightmare = require('nightmare');
const https = require('https');

var G = mongoose.model('game');
var EUROtoUSD = 1.15

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
}

/*module.exports.exchangeRates = function(req, res) {
	https.get({
		protocol: 'https:',
		hostname: 'api.exchangeratesapi.io',
		path: '/latest'
	}, (resp) => {
		let eur = '';

		resp.on('data', (chonk) => {
			eur += chonk;
		})

		resp.on('end', () => {
			EUROtoUSD = JSON.parse(eur).rates.USD
			sendJsonResponse(res, 200, EUROtoUSD)
		})
	})
}*/

module.exports.readOneGame = function(req,res) {
	if(req.params && req.params.appid) {
		console.log(req.params.appid);
		console.log(typeof req.params.appid);
		G.findOne({ "appid" : parseInt(req.params.appid) }, function(err, game) {
				console.log(err);
				console.log(game);
				if(!game) {
					sendJsonResponse(res, 404, {
						"message": "game id not found ID: " + req.params.appid
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

module.exports.getKinguinPrice = function(req,res) {
	const options = {
		protocol: 'https:',
    	hostname: 'api2.kinguin.net',
    	path: '/integration/v1/products/' + req.params.kid,
    	headers: {
       		"api-ecommerce-auth": '5327d6c9b3214d7a94f81b5531d6a54d'
    	}
	}

	var price;

	var makeRequest = function() {

		https.get(options, (resp) => {
			let data = '';

			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				if (data.charAt(0) == '<') {
					module.exports.getKinguinPrice(req, res);
				} else {
					data = JSON.parse(data);

					console.log(data)

					price = data.price * 1.15

					price = price.toString();
					price = price + "0"
					if(price.length > 6) { //ParseInt
						price = price.substring(0,5);
						sendJsonResponse(res, 200, { "price": "$" + price});
					} else {
						sendJsonResponse(res, 200, { "price": "$" + price});
					}
				
				}
			});

		});
	}

	var tryCatchRequest = function() {
		try {
			makeRequest();
		} catch (e) {
			tryCatchRequest();
		}
	}

	tryCatchRequest();
}

module.exports.getG2APrice = function(req,res) {
	const options = {
		protocol: 'https:',
		hostname: 'products-export-api.g2a.com',
		path: '/v1/products?includeOutOfStock=true&id=' + req.params.gid,
		headers: {
			Authorization: "nSbZhKCVhpoeyAsx, 10d19ba576a124bbabf0d27b62934ca9ff6c93233e56978699e5737cf90bb046"
		}
	}

	var price;

	var makeRequest = function() {

		https.get(options, (resp) => {
			let data = '';

			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				if (data.charAt(0) == '<') {
					module.exports.getG2APrice(req, res);
				} else {
					data = JSON.parse(data);

					console.log(data)

					price = data.docs[0].minPrice * 1.15;

					price = price.toString();
					price = price + "0";
					if(price.length > 6) { //ParseInt
						price = price.substring(0,5);
						sendJsonResponse(res, 200, { "price": "$" + price});
					} else {
						sendJsonResponse(res, 200, { "price": "$" + price});
					}
				
				}
			});

		});

	}

	var tryCatchRequest = function() {
		try {
			makeRequest();
		} catch (e) {
			tryCatchRequest();
		}
	}

	tryCatchRequest();
}