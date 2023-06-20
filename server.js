const exp = require('express');
const app=exp();
const mclient = require("mongodb").MongoClient;

require('dotenv').config()

//import path module
const path =require('path');
//connect build of react app with node.js
app.use(exp.static(path.join(__dirname,'./build')))

const DBUrl = process.env.DATABASE_CONNECTION_URL;
//connect with mongoDB Server

mclient.connect(DBUrl)
.then((client)=>{

    let dbObj=client.db("rickydeevenDB");
    let userCollectionObj = dbObj.collection("userCollection");
    let productCollectionObj = dbObj.collection("productCollection");
    app.set("userCollectionObj",userCollectionObj);
    app.set("productCollectionObj",productCollectionObj );
    console.log("Db connection success")
})
.catch(err=>
    console.log('error in DB connection',err)
)

//import userApp and productApp
const userApp = require('./APIS/userApi');
const productApp = require('./APIS/productApi');

//execute specific  middleware based on path
app.use('/user-api',userApp);
app.use('/product-api',productApp);

//handling invalid paths
app.use((req,res,next)=>{
    res.send({message:`path ${req.url} is Invalid`})
});
//error handling middleware
app.use((error,req,res,next)=>{
    res.send({message:"Error occurred", reason:`${error.message}`})
});
//assigning port number
const port = process.env.PORT;
app.listen(port,()=>console.log(`Web Server Listening on port ${port}`));