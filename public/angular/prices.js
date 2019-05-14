priceApp = angular.module('livePrices', []);

function bestPrice() {

	//$scope.$apply(function(){

	console.log("Finding best price...");

	var prices = document.getElementsByClassName("store-price");
	var stores = document.getElementsByClassName("store-link");

	let bestPrice = parseFloat(prices[0].innerHTML.replace('$', ''));
	let bestStore = stores[0].innerHTML;

	for (i = 0; i < 4; i++) { //Adjust for new prices
		console.log(prices[i].innerHTML.replace('$', ''));
		if (parseFloat(prices[i].innerHTML.replace('$', '')) <= bestPrice && parseFloat(prices[i].innerHTML) != 'NaN') {
			bestPrice = parseFloat(prices[i].innerHTML.replace('$', ''));
			bestStore = stores[i].innerHTML;
		}
	}

	return "Best Price: $" + bestPrice + " from " + bestStore;

	//});
	
}


priceApp.controller('getPrices', ['$scope', '$http', function($scope, $http) {

	$scope.exch = 1.15;

	/*$http.get('http://gamium.gg/api/priceconverter/').then(function(exchangeRate){
		console.log(exchangeRate)
	});*/

	$scope.bp = "Getting prices...";

	$scope.gog = "Getting Price...";
	$scope.kinguin = 'Getting Price...';
	$scope.g2a = 'Getting Price...';

	var name = encodeURIComponent(document.getElementsByTagName("h1")[0].innerHTML.replace('&amp;', '&'));

	$http.get('http://gamium.gg/api/gamesname/' + name).then(function(gameData) {
		console.log(gameData.data);
		var id = gameData.data.appid;
		if(gameData.data.gogprice) {
			console.log("starting price finding");
			$http.get('http://gamium.gg/api/gog/' + id).then(function(gogData) {
				console.log("gotten");
				var pricesLoaded = new Promise(function(resolve, reject) {
					console.log('GOG done');
					$scope.gog = gogData.data;	
					
					if($scope.gog == gogData.data) {
						resolve("Loaded")
					} else {
						reject("Error");
					}
				});

				pricesLoaded.then(function(result) {
					console.log(result); 
					
					$scope.$apply(function() {
						$scope.bp = bestPrice();
					});

					if(gameData.data.kinguinID) {

						var kinguinPrice = new Promise(function(resolve, reject){
							console.log("Getting Kinguin Price...")
							$http.get('http://gamium.gg/api/kinguin/' + gameData.data.kinguinID).then(function(kinguinData){
								console.log(kinguinData);
								$scope.kinguin = kinguinData.data.price;

								if($scope.kinguin == kinguinData.data.price) {
									resolve("Loaded");
								} else {
									reject("Error");
								}
							});
						});

						kinguinPrice.then(function(kResult) {
							console.log(kResult);

							$scope.$apply(function() {
								$scope.bp = bestPrice();
							});

						});
					}

					if(gameData.data.g2aID) {

						var g2aPrice = new Promise(function(resolve, reject) {
							console.log("Getting G2A Price...")
							$http.get('http://gamium.gg/api/g2a/' + gameData.data.g2aID).then(function(g2aData) {
								console.log(g2aData);
								$scope.g2a = g2aData.data.price;

								if($scope.g2a == g2aData.data.price) {
									resolve("Loaded");
								} else {
									reject("Error");
								}
							});
						});

						g2aPrice.then(function(g2aResult) {
							console.log(g2aResult);

							$scope.$apply(function() {
								$scope.bp = bestPrice();
							});
						});
					} else {
						$scope.g2a = "Not Sold Here"
					}

				});




			});
		} else {
			$scope.gog = "Not Sold Here";

			if(gameData.data.kinguinID) {

				var kinguinPrice = new Promise(function(resolve, reject){
					$http.get('http://gamium.gg/api/kinguin/' + gameData.data.kinguinID).then(function(kinguinData){
						console.log(kinguinData);
						$scope.kinguin = kinguinData.data.price;

						if($scope.kinguin == kinguinData.data.price) {
							resolve("Loaded");
						} else {
							reject("Error");
						}
					});
				});

				kinguinPrice.then(function(kResult) {
					console.log(kResult);

					$scope.$apply(function() {
							$scope.bp = bestPrice();
					});

				});

			} else {
				$scope.kinguin = "Not Sold Here"
			}

			if(gameData.data.g2aID) {

				var g2aPrice = new Promise(function(resolve, reject) {
					$http.get('http://gamium.gg/api/g2a/' + gameData.data.g2aID).then(function(g2aData) {
						console.log(g2aData);
						$scope.g2a = g2aData.data.price;

						if($scope.g2a == g2aData.data.price) {
							resolve("Loaded");
						} else {
							reject("Error");
						}
					});
				});

				g2aPrice.then(function(g2aResult) {
					console.log(g2aResult);

					$scope.$apply(function() {
							$scope.bp = bestPrice();
					});

				});

				
			} else {
				$scope.g2a = "Not Sold Here"
			}
		}
	});


}]);