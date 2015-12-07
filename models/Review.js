var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	userId: String,
	review: String,
	rating: Number,
	catererId: String
});

module.exports = mongoose.model('Review', reviewSchema);