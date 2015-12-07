var express = require('express');
var app = express();
var fs = require('fs');
var parser = require('body-parser');
var session = require('express-session');

app.use(express.static('public'));
app.use(parser.json())
app.use(session({secret: '#uk!t'}));
//app.use(session({secret: '#uk!t', cookie: {httpOnly: true, secure: true}}));

require('./routers/router')(app);

var server = app.listen(3000, function () {
  console.log('Server listening at port 3000');
});

