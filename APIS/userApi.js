const exp = require('express');
const userApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require("dotenv").config()

userApp.use(exp.json())

//get users route
userApp.get('/getusers',expressAsyncHandler(async(req,res)=>{
    let userCollectionObj = req.app.get("userCollectionObj");
    let users = await userCollectionObj.find().toArray()
    res.send({message:'all users',payload:users})
    
}));
//user login route
userApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //gte userCollectionObject
    let userCollectionObj = req.app.get("userCollectionObj");
    //get user credentials obj from client
    let userCredObj = req.body;
    //search for user by username
    let userOfDb = await userCollectionObj.findOne({username:userCredObj.username});
    if(userOfDb==null)
    {
        res.send({message:'Invalid user'});
    }
    else
    {
        let status = await bcryptjs.compare(userCredObj.password,userOfDb.password);
        if(status==false)
        {
            res.send({message:'Invalid password'});
        }
        else
        {
            let token = jwt.sign({username:userOfDb.username},process.env.SECRET_KEY,{expiresIn:60})
            res.send({message:"login Success",payload:token,userObj:userOfDb})
        }
    }
}));

//create-user route
userApp.post('/create-user',expressAsyncHandler(async (req,res)=>{
    let userCollectionObj = req.app.get("userCollectionObj");
    let newUserObj = req.body;
    let userOfDB = await userCollectionObj.findOne({username:newUserObj.username})
    if(userOfDB!==null)
    {
        res.send({message:'username already exists.Please choose another username'})
    }
    else
    {
        let hashedPassword = await bcryptjs.hash(newUserObj.password,6);
        newUserObj.password = hashedPassword;
        await userCollectionObj.insertOne(newUserObj)
        res.send({message:'new user created'})
    }
}));

//update-user route
userApp.put('/update-user',expressAsyncHandler(async(req,res)=>{
    let userCollectionObj = req.app.get("userCollectionObj");
}));
//delete-user route
userApp.delete('/remove-user/:id',expressAsyncHandler(async(req,res)=>{

}));

module.exports = userApp;