var express = require('express');
var app = express();


var User = require(__dirname + '/FSAPI/Users');
const port = process.env.port || 3001;

var bcrypt = require('bcrypt');

const sessions = require('express-session');
var cookieParser = require('cookie-parser');

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(cookieParser());


app.use(express.static('public'));
app.use(express.static('public/pages'));


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async function(req, res) {	
    let session=req.session;
    let user = session.user;
    console.log('Cookies: ', req.cookies);
    console.log('Signed Cookies: ', req.signedCookies);
    console.log(user);
    if(!user && !req.cookies.user){
      res.sendFile(__dirname + "/public/pages/main.html");
    }else{
      return res.redirect("/home");
    }
    // res.send("999");
});
app.post('/', async function(req, res) { 
    let session=req.session;
    
    if(!req.body.username.match("[A-Za-z0-9]{4,16}")){
      return res.json({error_code: 1});
    }else if(!req.body.password.match("[A-Za-z0-9]{4,16}")){
      return res.json({error_code: 2});
    }else{
      var userIsset = await User.userIsset(req.body.username, req.body.password);
      if(userIsset.userIsset){
        session.user = userIsset.user;
        if(req.body.rememberMe){
          res.cookie('user', JSON.stringify(userIsset.user), {expire: 360000 + Date.now()}); 
        }

        return res.json({success: true, id: userIsset.user.id});
      }else{
        return res.json({error_code: 3});
      }
      
    }
});
app.get('/register', async function(req, res) {
    let session=req.session;
    let user = session.user;
    if(!user && !req.cookies.user){
      res.sendFile(__dirname + "/public/pages/register.html");
    }else{
      res.redirect("/home/ + user.id");
    }
});
app.post('/register', async function(req, res) {
  let session=req.session;
  if(!req.body.firstName.match("[a-z]{3,55}")){
    return res.json({error_code: 1});
  }else if(!req.body.lastName.match("[a-z]{3,55}")){
    return res.json({error_code: 2});
  }else if(!req.body.username.match("[A-Za-z0-9]{4,16}")){
    return res.json({error_code: 3});
  }else if(!await User.usernameIsUniq(req.body.username)){
    return res.json({error_code: 4});
  }else if(!req.body.password.match("[A-Za-z0-9]{4,16}")){
    return res.json({error_code: 5});
  }else{
    var id = await User.userCreate(req.body.firstName, req.body.lastName, req.body.username, await bcrypt.hash(req.body.password, 10), req.body.gender, req.body.date, req.body.rememberMe);
    var newUser = {
      id, 
      ...req.body
    };
    session.user = newUser;
    if(req.body.rememberMe){
      res.cookie('user', JSON.stringify(userIsset.user), {expire: 360000 + Date.now()}); 
    }
    return res.json({success: true, id: id});
  }
});

app.get('/home', async function(req, res) {
    console.log('Cookies: ', req.cookies);
    console.log('Signed Cookies: ', req.signedCookies);
    let session=req.session;
    let user = session.user;
    console.log(user);
    if(user || req.cookies.user){
      res.sendFile(__dirname + "/public/pages/home.html");
    }else{
      return res.redirect("/");
    }
  	
});

app.get('/home/:id', async function(req, res) {
    console.log('Cookies: ', req.cookies);
    console.log('Signed Cookies: ', req.signedCookies);
    let session=req.session;
    let user = session.user;
    if(user || req.cookies.user){
      res.sendFile(__dirname + "/public/pages/home.html");
    }else{
      return res.redirect("/");
    }
    
});


app.get('/session-user',  async function(req, res) {
    let session=req.session;
    let user = session.user;
    return res.json(user);
});
app.get('/cookie-user',  async function(req, res) {
    if(req.cookies.user){
      let user = JSON.parse(req.cookies.user);
      return res.json(user);
    }else{
      return res.json({});
    }
});

app.get('/logout', async function(req, res) {
    let session=req.session;
    session.user = undefined;
    res.clearCookie('user');
    res.redirect("/");
});

app.listen(port, () => {
  	console.log(`Example app listening on port ${port}`)
})
