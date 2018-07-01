// GET Home Page
module.exports.homepage = function(req, res) {
	res.render('index', {
		title: 'Home',
		fg1: {
			name: 'Counter Strike: Global Offensive',
			price: '$15.00'
		},
		fg2: {
			name: "PLAYERUNKNOWN'S BATTLEGROUNDS",
			price: "$25.00"
		},
		fg3: {
			name: "Portal",
			price: "$9.99"
		},
		topSellers : [{
				name: 'Counter Strike: Global Offensive',
				dev: 'Valve',
				price: '$15.00',
				img: 'https://steamcdn-a.opskins.media/steam/apps/730/header.jpg?t=1529967656'
			}, {
				name: "PLAYERUNKNOWN'S BATTLEGROUNDS",
				dev: "PLAYERUNKNOWN",
				price: "$25.00",
				img: 'https://steamcdn-a.opskins.media/steam/apps/578080/header.jpg?t=1530257691'
			}, {
				name: "Portal",
				dev: "Valve",
				price: "$10.00",
				img: 'https://steamcdn-a.opskins.media/steam/apps/400/header.jpg?t=1529612311'
			}, {
				name: "7 Days to Die",
				dev: "The Fun Pimps",
				price: "$9.00",
				img: "https://steamcdn-a.opskins.media/steam/apps/251570/header.jpg?t=1530012284"
			}, {
				name: "Bioshock Infinite",
				dev: "Irrational Games",
				price: "$7.50",
				img: "https://steamcdn-a.opskins.media/steam/apps/8870/header.jpg?t=1530032961"
			}, {
				name: "Call of Duty: Black Ops II",
				dev: "Treyarch",
				price: "$24.99",
				img: "https://steamcdn-a.opskins.media/steam/apps/202970/header.jpg?t=1530201257"

			}, {
				name: "Deus Ex: Mankind Devided",
				dev: "Square Enix",
				price: "$19.99",
				img: "https://steamcdn-a.opskins.media/steam/apps/337000/header.jpg?t=1530201264"
			}, {
				name: "Fallout 4",
				dev: "Bethesda",
				price: "$25.99",
				img: "https://steamcdn-a.opskins.media/steam/apps/377160/header.jpg?t=1530109336"
			}]
	});
}

module.exports.game = function(req, res) {
	res.render('game', {
		title: 'Counter Strike: Global Offensive',
		gameInfo: {
			name: 'Counter Strike: Global Offensive',
			dev: "Valve",
			publisher: "Valve",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			img: "https://steamcdn-a.opskins.media/steam/apps/730/header.jpg?t=1529967656",
			releaseDate: "August 21, 2012"
		}
	})
}