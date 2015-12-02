var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var mongojs = require('mongojs'); 
var db = mongojs('users', ['users', 'displays']); 

app.use(express.static(__dirname)); 
app.use(bodyParser.json());

db.users.count(function(err, count){
	if(err){
		console.log("oops"); 
	}else{
		console.log(count); 
	}
});

app.listen(3000); 
console.log("Server is running..."); 