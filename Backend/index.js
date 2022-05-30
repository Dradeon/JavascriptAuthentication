const express = require('express');
const bodyParser = require("body-parser")
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const User = require('./user');
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
    
    try {
        const userExist = await User.find({username:username}).exec();
        console.log(userExist);
        if(userExist.length !== 0){
            return res.status(400).send("Username Taken")
        }

        hashedPass = await bcrypt.hash(password,10);

        //  Save to DB
        const newUser = new User({username:username,password:hashedPass});
        await newUser.save();
        console.log(newUser);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }

    
    console.log(users)
    return res.status(200).send("User Created")
});

app.post('/login', async(req,res) => {
    
    const username = req.body.user;
    const password = req.body.pass;
     

    try {
        const userInfo = await User.find({username:username}).exec();
        console.log(userInfo[0]);
        if(userInfo.length == 0){
            return res.status(400).send("Invalid Username/Password");
        }

        const correctPass = await bcrypt.compare(password, userInfo[0].password)
        if(!correctPass){
            return res.status(400).send("Invalid Username/Password");
        }

        payload = {username:userInfo[0].username,password:userInfo[0].password}

        const token = await jwt.sign(payload, process.env.TOKEN_SECRET);
        console.log(token);
        return res.status(200).json({'auth-token':token});

    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
    
    

    
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