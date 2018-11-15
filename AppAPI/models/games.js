var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	appid: {
		type: Number,
		required: false
	},
	img: {
		type: String,
		required: false
	},
	description: {
		type: String,
		required: true
	},
	dev: {
		type: String,
		required: false
	},
	publisher: {
		type: String,
		required: false
	},
	rDate: {
		type: String,
		required: false
	},
	goglink: {
		type: String,
		required: false
	},
	gogprice: {
		type: String,
		required: false
	},
	gogPrice: {
		type: String,
		required: false
	},
	"gog-link": {
		type: String,
		required: false
	},
	"gog-price": {
		type: String,
		required: false
	},



});

gameSchema.index( {name: 'text'} )

mongoose.model('game', gameSchema);

