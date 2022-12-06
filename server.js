// CYCLIC URL: https://bright-gold-pike.cyclic.app/

var express = require("express");
var path = require("path");
const app = express();
app.use(express.static("public"));
var final = require('./final.js');
const port = process.env.PORT || 8080;


app.get("/", function(req,res){
  res.sendFile(path.join(__dirname, 'finalViews/home.html'));
});

app.get("/register", function(req,res){
  res.sendFile(path.join(__dirname, 'finalViews/register.html'));
});

app.get("/signIn", function(req,res){
  res.sendFile(path.join(__dirname, 'finalViews/signIn.html'));
});

app.post("/register",(req, res) => {
  final.register(req.body).then(() =>{
  }).catch(err => res.render({message: "ERROR: Email or Password does not match"}));
});

app.post("/signIn",(req, res) => {
  final.signIn().then(() =>{
  }).catch(err => res.render({message: "ERROR: Email or Password does not match"}));

})

  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });
  final.startDB().then(function () {
    app.listen(port, onhttp);
   })
   .catch(function (err) {
     console.log('Failed to start!' + err);
   });
  
   function onhttp(){
    console.log("Express http server listening on port",port);
  }