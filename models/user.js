var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db10');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  permission: Number,
  description: String,
  displayname: String,
  image: String,
  ip: [String],
  alluserPage: Number,
  profilePage: Number,
  editPage: Number,
  trackPage: Number

  
});

module.exports = mongoose.model('User', userSchema);