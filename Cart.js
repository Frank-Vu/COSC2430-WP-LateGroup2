const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userid: String, require: true,
    products: [{
        productid: String,
        quantity: Number, default:1,
    }]
},
    {
        timestamps:true
});


module.exports = mongoose.model('Cart',cartSchema)
