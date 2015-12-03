var mongoose = require('mongoose');
var Tag = require('./Tag');
var Order = require('./Order');
var Review = require('./Review');

var catererProfile = new mongoose.Schema({
  priceRange: Number,
  tags: [Tag],
  orders: [Order],
  rating: Number,
  speciality: [String],
  address: String,
  reviews: [Review]
});

module.exports = mongoose.model('CatererProfile', catererProfile);