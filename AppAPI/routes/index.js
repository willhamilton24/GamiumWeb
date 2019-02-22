var express = require( 'express' );
var router = express.Router();
var ctrlGames = require( '../controllers/games' );

//Get Info For One Game
router.get('/games/:appid', ctrlGames.readOneGame);

//Get Info For One Game By Name
router.get('/gamesname/:name', ctrlGames.readOneGameByName);

//Get GOG Price For a Game
router.get('/gog/:appid', ctrlGames.getGOGPrice);

//Get Kinguin Price For a Game
router.get('/kinguin/:kid', ctrlGames.getKinguinPrice);

//Get G2A Price For a Game
router.get('/g2a/:gid', ctrlGames.getG2APrice)

//Get Search Results
router.get('/s/:query', ctrlGames.getSearchResults);

module.exports = router;