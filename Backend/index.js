const express = require('express');
const bodyParser = require("body-parser")
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const {verifyToken} = require("./auth");
require('dotenv').config()

app = new express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(`mongodb+srv://RezaCluster:${process.env.DB_PASS}@cluster0.wdvhzsk.mongodb.net/?retryWrites=true&w=majority`, ()=>{
    console.log("Connected to Database");
})

let users = [{id: 0, user:"User123", pass: "Pass123"}]

let blogPosts = [
    {
        id: 1,
        title: "Title 1"
    },
    {
        id: 2,
        title: "Title 2"
    },
    {
        id: 3,
        title: "Title 3"
    }
];

app.post('/signup', async(req, res) => {
    const username = req.body.user;
    const password = req.body.pass;

    if(users.find((user)=>{
        if(user.user == username){
            return user;
        }
    })){
        return res.status(400).send("Username Taken")
    }

    try {
        hashedPass = await bcrypt.hash(password,10);
        users.push({id:users.length, user:username, pass:hashedPass});
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }

    
    console.log(users)
    return res.status(200).send("User Created")
});

app.post('/login', async(req,res) => {
    
    const username = req.body.user;
    const password = req.body.pass;
    const userInfo = users.find((person)=>{
        if (person.user == username){
            return person;
        }
    });

    if(userInfo == null){
        return res.status(400).send("Invalid Username/Password");
    }

    try {
        const correctPass = await bcrypt.compare(password, userInfo.pass)
        if(!correctPass){
            return res.status(400).send("Invalid Username/Password");
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
    
    

    jwt.sign(userInfo, process.env.TOKEN_SECRET, function(error,token){
        return res.status(200).json({'auth-token':token});
    });
})

app.get('/posts',function(req,res){

    if(verifyToken(req,res) == false){
        return res.status(400).send("Login Needed")
    }
    
    console.log("Getting Posts");
    return res.status(200).json({blogPosts});

})

app.listen(8080, ()=>{
    console.log("server started on port 8080")
})