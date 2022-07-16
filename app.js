//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    email : String, 
    password : String
});

// const secret = "Thisisourlittlesecret.";
//added above file to .env
//variable naming convention
//key entirely in uppercase then = without spaces then text without ""
//eg ABC=aslfj
    // API=AJD:L


userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields:["password"]});

// encrypted fields is used to encrypt only specific fields
// plugin needs to be added before creating a model
// when data is saved using .save the passwd is encrypted
// when find one is called the password is decrypted

//password can be seen in 
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});



app.post("/register", function(req, res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email : username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    })
});
app.post("/register", function(req, res){

});

app.listen(3000, function(req,res){
    console.log("Hearing you out on port 3000");
})