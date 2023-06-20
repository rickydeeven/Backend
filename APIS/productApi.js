const exp = require('express');
const productApp = exp.Router();

const expressAsyncHandler = require('express-async-handler')

productApp.use(exp.json());

//getproducts route
productApp.get('/getproducts',expressAsyncHandler(async (req,res)=>{
    let productCollectionObj = req.app.get("productCollectionObj");
    let products = await productCollectionObj.find().toArray()
    res.send({message:'all products',payload:products})
}));
//getproduct by id route
productApp.get('/getproduct/:id',expressAsyncHandler(async(req,res)=>{
    let productCollectionObj = req.app.get("productCollectionObj");
    let pid = (+req.params.id);
    let product = await productCollectionObj.findOne({productId:pid});
    if(product==null){
        res.send({message:'product does not existed'})
    }
    else{
        res.send({message:'product existed',payload:product})
    }
}));
//create-product route
productApp.post('/create-product',expressAsyncHandler(async (request,response)=>{

    let productCollectionObj = request.app.get("productCollectionObj");
    let productObj = request.body;
    let result = await productCollectionObj.insertOne(productObj);
    response.send({message:'product created successfully'});
}));
//update-product route
productApp.put('/update-product',expressAsyncHandler(async(request,response)=>{
    let productCollectionObj = request.app.get("productCollectionObj");
    let modifiedProduct = request.body;
    await productCollectionObj.updateOne({productId:modifiedProduct.productId},{$set:{...modifiedProduct}})
    response.send({message:'product modified'})
}));

productApp.delete("/remove-product/:id",expressAsyncHandler(async(req,res)=>{
    let productCollectionObj = req.app.get("productCollectionObj");
}))
module.exports = productApp;