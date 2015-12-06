var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	id: Number,
	userId: String,
	review: String,
	rating: Number,
	catererId: String
});

module.exports = mongoose.model('Review', reviewSchema);