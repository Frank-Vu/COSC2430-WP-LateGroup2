const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userid: String, require: true,
    products: [{
        productid: String,
        quantity: Number, default:1,
    }],
    amount: Number, require:true,
    address: Object, require:true,
    status: String, default: 'pending',
},
    {
        timestamps:true
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;
