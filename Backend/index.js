const express = require('express');
const bodyParser = require("body-parser")
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const Blog = require('./schemas/blogs');
const User = require('./schemas/user');
const {verifyToken} = require("./auth");
require('dotenv').config()

app = new express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.URL, ()=>{
    console.log("Connected to Database");
})

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

        return res.status(200).send("User Created")

    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    } 
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
        return res.status(200).json({'auth-token':token});

    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
    
    

    
})

app.get('/posts', async function(req,res){
    const user = verifyToken(req,res);
    if(user == false){
        return res.status(400).send("Login Needed")
    }
    try {
        console.log("Getting Posts");
        const blogPosts = await Blog.find().exec();
        console.log(blogPosts);
        res.header('Username',user.username);
        res.header('Access-Control-Expose-Headers','Username');
        return res.status(200).send(blogPosts);
    } catch (error) {
        console.log(error);
    }
})

app.listen(8080, ()=>{
    console.log("server started on port 8080")
})