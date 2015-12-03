var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db10');

var CatererProfile = require('./CatererProfile');
var UserProfile = require('./UserProfile');

var userSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  aboutMe: String,
  displayname: String,
  image: String,
  catererProfile: CatererProfile,
  userProfile: UserProfile

});

module.exports = mongoose.model('User', userSchema);