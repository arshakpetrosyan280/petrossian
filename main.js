
var User = require(__dirname + '/FSAPI/Users');
const port = process.env.port || 3001;

var express = require('express');
var bcrypt = require('bcrypt');


var LS = require(__dirname + '/FSAPI/LS');

var storage = new LS();

var app = express();


app.use(express.static('public'));
app.use(express.static('public/pages'));


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async function(req, res) {	
    let user = (await storage.getUser()).user;
    if(user === undefined){
      res.sendFile(__dirname + "/public/pages/index.html");
    }else{
      return res.redirect("/home/" + user.id + "/");
    }
});
app.post('/', async function(req, res) { 
    if(!req.body.username.match("[A-Za-z0-9]{4,16}")){
      return res.json({error_code: 1});
    }else if(!req.body.password.match("[A-Za-z0-9]{4,16}")){
      return res.json({error_code: 2});
    }else{
      var userIsset = await User.userIsset(req.body.username, req.body.password);
      if(userIsset.userIsset){
        storage.setUser(userIsset.user);
        return res.json({success: true, id: userIsset.user.id});
      }else{
        return res.json({error_code: 3});
      }
      
    }
});
app.get('/register', async function(req, res) {
    let user = (await storage.getUser()).user;
    if(user === undefined){
      res.sendFile(__dirname + "/public/pages/register.html");
    }else{
      res.redirect("/home/ + user.id");
    }
});
app.post('/register', async function(req, res) {
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
    storage.setUser(newUser);
    return res.json({success: true, id: id});
  }
});

app.get('/home/:id', async function(req, res) {
  console.log(typeof res.statusCode);
    let user = (await storage.getUser()).user;
    if(user !== undefined){
      res.sendFile(__dirname + "/public/pages/home.html");
      // if(res.statusCode !== 200){
      //   res.redirect('/home/' + 1);
      // }
    }else{
      return res.redirect("/");
    }
  	
});

app.get('/logout', async function(req, res) {
  await storage.unlinkUser();
  res.redirect("/");
});

app.get('/session-user', async function(req, res) {
  let user = (await storage.getUser()).user;
  return res.json(user);
});
app.listen(port, () => {
  	console.log(`Example app listening on port ${port}`)
})
