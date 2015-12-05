var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db10');

var UserProfile = require('./UserProfile');

var userSchema = new mongoose.Schema({	
  username: String,
  password: String,
  aboutMe: String,
  displayname: String,
  image: String,
  userProfile: [UserProfile]

});

module.exports = mongoose.model('User', userSchema);