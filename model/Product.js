const mongoose = require('mongoose');

//Connect to MongoDB database USERS
mongoose.connect('mongodb+srv://mandatvippro:bruh@cluster0.nzxajuv.mongodb.net/test-product-page?retryWrites=true&w=majority')
    .then(() => {
        console.log(`Connection established!`);
    })
    .catch((error) => {
        console.log(error.message);
    });

//Product information:
const productSchema = new mongoose.Schema({
    vendor_id: String,
    name: String,
    price: String,
    image: {
        data: Buffer,
        mimeType: String,
    },
    description: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;