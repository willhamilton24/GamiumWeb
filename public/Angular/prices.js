priceApp = angular.module('livePrices', []);

var apiOptions = {
	server : "http://192.168.1.87:3000"
}

function bestPrice($scope) {
	var prices = document.getElementsByClassName("price");
	var stores = document.getElementsByClassName("storeLink");

	let bestPrice = parseFloat(prices[0].innerHTML.replace('$', ''));
	let bestStore = stores[0].innerHTML;

	for (i = 0; i < 2; i++) { //Adjust for new prices
		if (parseFloat(prices[i].innerHTML.replace('$', '')) <= bestPrice && parseFloat(prices[i].innerHTML) != 'NaN') {
			bestPrice = parseFloat(prices[i].innerHTML.replace('$', ''));
			bestStore = stores[i].innerHTML;
		}
	}

	$scope.bp = "Best Price: $" + bestPrice + " from " + bestStore;
}

priceApp.controller('getPrices', ['$scope', '$http', function($scope, $http) {

	bestPrice($scope);

	$scope.gog = "Getting Price...";
	$scope.kinguin = 'Price Data Not Yet Available';
	$scope.g2a = 'Price Data Not Yet Available';

	var name = document.getElementsByTagName("h1")[0].innerHTML.replace(/\s+/g, 'shpashe');

	$http.get(apiOptions.server + '/api/gamesname/' + name).then(function(gameData) {
		console.log(gameData.data);
		var id = gameData.data.appid;
		if(gameData.data.goglink) {
			$http.get(apiOptions.server + '/api/gog/' + id).then(function(gogData) {
				console.log('GOG done');
				$scope.gog = gogData.data;
				bestPrice($scope);
			});
		} else {
			$scope.gog = "Not Sold Here";
		}
	});


}]);