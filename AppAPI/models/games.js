var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	name_slug: {
		type: String,
		required: true
	},
	appid: {
		type: String,
		required: true
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
	gogLink: {
		type: String,
		required: false
	},
	g2aID: {
		type: String,
		required: false
	},
	g2aLink: {
		type: String,
		required: false
	}
	kinguinID: {
		type: String,
		required: false
	}
});

var G = mongoose.model('game', gameSchema);

