var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db10');

var UserProfile = require('./UserProfile');
var CatererProfile = require('./CatererProfile');

var userSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  aboutMe: String,
  displayname: String,
  image: String,
  userProfile: [UserProfile],
  catererProfile: [CatererProfile]

});

module.exports = mongoose.model('User', userSchema);