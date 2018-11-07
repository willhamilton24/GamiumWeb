priceApp = angular.module('livePrices', []);

function bestPrice() {

	//$scope.$apply(function(){

	console.log("Finding best price...");

	var prices = document.getElementsByClassName("price");
	var stores = document.getElementsByClassName("storeLink");

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

	//bestPrice($scope);

	$scope.bp = "Getting prices...";

	$scope.gog = "Getting Price...";
	$scope.kinguin = 'Price Data Not Yet Available';
	$scope.g2a = 'Price Data Not Yet Available';

	var name = document.getElementsByTagName("h1")[0].innerHTML.replace(/\s+/g, 'shpashe');

	$http.get('http://hamiltondynamic.tk/api/gamesname/' + name).then(function(gameData) {
		console.log(gameData.data);
		var id = gameData.data.appid;
		if(gameData.data.goglink) {
			console.log("starting price finding");
			$http.get('http://hamiltondynamic.tk/api/gog/' + id).then(function(gogData) {
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
				})

			});
		} else {
			$scope.gog = "Not Sold Here";
		}
	});


}]);