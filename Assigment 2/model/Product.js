const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://mandatvippro:hello@cluster0.tkq3jsi.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>console.log('Connect to MongoDB Atlas'))
    .catch((error)=>console.log(error.message));

const productSchema = new mongoose.Schema({
    title: {type: String, require: true, unquie: true},
    desc: {type: String, require: true}, 
    categories: {type: String, require: true},
    price: {type: Number, require: true},
    },
        {
        timestamps:true
    });

const Product = mongoose.model('Product', productSchema)  

module.exports = Product;
