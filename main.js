var express = require('express');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local');
var passport = require('passport');
var bcrypt = require('bcrypt');

var app = express();
const port = 3000;

var session = {
  secret: 'keyboard cat',
  cookie: {}
}

app.use(expressSession(session));
app.use(express.static('public'));

app.get('/', function(req, res, next) {
  	res.sendFile("index.html");
});
app.get('/ape', function(req, res, next) {
  	res.send("44");
});
app.listen(port, () => {
  	console.log(`Example app listening on port ${port}`)
})
