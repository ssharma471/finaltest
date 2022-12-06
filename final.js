const fs = require('fs');
var db ='mongodb+srv://Sidhant:1234@senecaweb.gza5hqd.mongodb.net/?retryWrites=true&w=majority';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var finalUsers = new Schema({
  "email":{
    type: String,
    unique: true
},
  "password": String,
});

let User;

module.exports.startDB = function(){
  return new Promise((resolve, reject)=> {
      User= mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, function(error){
          if(error){console.log(error);
              reject();
      }
          else {
            console.log("DB connection successful.");
           User = User.model("users", finalUsers); 
          resolve();           
      }
      });
  });
}

module.exports.register = function(userData){
  return new Promise((resolve, reject)=> {
  if(userData.password === "" || userData.email === "" ){
      reject("Error: email or password cannot be empty or only white spaces! ");
  }
  bcrypt.genSalt(10, function(err, salt) { 
      bcrypt.hash(userData.password, salt, function(err, hashValue) { 
         if(err){
          reject("ERROR!!!");   
         }else{
          userData.password = hashValue;
          let newUser = new  User(userData);
  newUser.save((err) => {
      if(err && err.code == 11000) {
        reject("users email used");
      } else if(err && err.code != 11000) {
        reject("Error: cannot create the user. "+err);
      }
      else{
          console.log("It is working"); 
          resolve();
      }
    });   
         }
      });
      });
  });
}

module.exports.signIn = function(userData){
  return new Promise((resolve, reject)=> {
      User.findOne({ email: userData.email})
      .exec()
      .then((data) => {
       if (!data){
          console.log("Unable to find user: "+userData.email);
          reject();
       } else{
          bcrypt.compare(userData.password, data.password).then((res) => {
      
              if (res === true) {
                  data.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                  console.log("User found");
                
                }
                else if(res === false){
                  reject("Unable to find user: "+userData.email);
                }
              });
       }
      })
  });
}


