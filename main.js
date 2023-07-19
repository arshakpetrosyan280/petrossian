
var User = require(__dirname + '/FSAPI/Users');

var express = require('express');
var expressSession = require('express-session');
var bcrypt = require('bcrypt');

var app = express();
const port = process.env.port || 3001;

var session = {
  secret: 'keyboard cat',
  cookie: {}
}

app.use(expressSession(session));
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', function(req, res, next) {	
  	res.sendFile("index.html");
});
app.get('/register', function(req, res, next) {
  	res.sendFile(__dirname + "/public/pages/register.html");
});
app.post('/register', async function(req, res) {
	User.userCreate(req.body.firstName, req.body.lastName, req.body.username, await bcrypt.hash(req.body.password, 10));
  if(req.body.firstName === "ape"){
    console.log(req.body);
  }
  res.send({error: false});
});

app.get('/ape', function(req, res, next) {


		res.send("44");
  	
});
app.listen(port, () => {
  	console.log(`Example app listening on port ${port}`)
})
