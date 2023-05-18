const product =[ {
    name: 'bruhbruhbruh',
    price: 1000,
    description: 'lol',
    vendor: 1,
},
{
    name: 'bruh',
    price: 1000,
    description: 'lol',
    vendor: 1,
},
{
    name: 'bruh',
    price: 1000,
    description: 'lol',
    vendor: 1,
},
{
    name: 'bruh',
    price: 1000,
    description: 'lol',
    vendor: 1,
},
]

let Product = require('./Product');

// Insert many documents
Product.insertMany(product)
.then(() => console.log('Many products are saved'))
.catch((error) => console.log(error.message));
