var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db12');

/*
Type:
	1 - User
	2 - Caterer
	3 - Admin

*/

var accountSchema = new mongoose.Schema({
  type: Number,	
  username: String,
  password: String,
  aboutMe: String,
  displayname: String,
  image: String,
  catererProfile: {
  	  priceRange: Number,
	  tags: [String],
	  orders: [Number],
	  rating: Number,
	  speciality: [String],
	  address: String,
	  reviews: [Number]
  },

});

module.exports = mongoose.model('Account', accountSchema);