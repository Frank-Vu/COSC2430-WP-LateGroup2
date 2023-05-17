const product =[ {
    name: 'bruh',
    price: 1000,
    description: 'lol',
    
},
{
    name: 'bruh',
    price: 1000,
    description: 'lol',
    
},
{
    name: 'bruh',
    price: 1000,
    description: 'lol',
    
},
{
    name: 'bruh',
    price: 1000,
    description: 'lol',
    
},
]

let Product = require('./Product');

// Insert many documents
Product.insertMany(product)
.then(() => console.log('Many products are saved'))
.catch((error) => console.log(error.message));
