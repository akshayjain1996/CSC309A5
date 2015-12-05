var mongoose = require('mongoose');


var userProfile = new mongoose.Schema({
  follows: [String], 
  favs: [String], 
});

module.exports = mongoose.model('UserProfile', userProfile);