const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String, require: true, unquie: true,
    desc: String, require: true, 
    categories: Array,
    size: String, 
    color: String, 
    price: Number, require: true,
    },
        {
        timestamps:true
    });

module.exports = mongoose.model('Product', productSchema)
