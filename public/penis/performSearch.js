/*

var apiOptions = {
	server : "http://192.168.1.87:3000"
}

searchApp = angular.module('searchApp', []);



searchApp.controller('searchController', [ '$http', '$scope', function($http, $scope) {

	function searchTop() {
		console.log('Redirecting....')
		searchBar = document.getElementsByClassName("topSearch")[0];
		searchQuery = encodeURIComponent(searchBar.content);
		console.log(searchQuery);

		$http.get(apiOptions.server + '/sr/' + searchQuery);

	}
}])

*/

// Paste In Jade (ng-app='searchApp' ng-controller='searchController')