var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db10');
var Tag = require('./tag');
var Order = require('./order');
var Review = require('./review');

var userSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  aboutMe: String,
  displayname: String,
  image: String,
  address: String,
  priceRange: Number,
  tags: [Tag],
  orders: [Order],
  rating: Number,
  speciality: [String],
  reviews: [Review]
});

module.exports = mongoose.model('User', userSchema);