const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product =require('./model/Product')

app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(express.json());

app.get('/cat-test',(req,res)=>{
    Product.find({'categories': 'equipment'}, 'title', 'desc', 'price', function(err,product){
        if (err) return handleError(err);
        console.log('%s %s %s %s',title, desc, categories, price)
    })
});
app.listen(3000,()=>{
    console.log('Backend is running')
})
