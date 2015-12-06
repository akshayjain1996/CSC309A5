var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	id: Number,
	name: String
});

module.exports = mongoose.model('Tag', tagSchema);