const mongoose = require('mongoose');
const Nightmare = require('nightmare');
const https = require('https');

const G = mongoose.model('game');
let EUROtoUSD = 1.15;

const sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
}

const getPriceCoeficient = () => {
	https.get('https://api.exchangeratesapi.io/latest', (rates) => {
		let data = '';
		rates.on('data', (chunk) => {
			data += chunk
		});

		rates.on('end', () => {
			EUROtoUSD = JSON.parse(data).rates.USD
		})
	})
}

const parseEuros = (priceInEuros) => {
	let price = (priceInEuros * EUROtoUSD).toString().substring(0, price.indexOf('.' + 2);
	let point = price.indexOf('.');
	let p1 = price.substring(0, point);
	let p2 = price.substring(point).substring(0,2)

	sendJsonResponse(res, 200, { "price": "$" + price});
}

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
	getPriceCoeficient();
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

					parseEuros(data.price)
				
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

					parseEuros(data.docs[0].minPrice);
				
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