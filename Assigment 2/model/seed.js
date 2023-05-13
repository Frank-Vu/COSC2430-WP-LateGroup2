const product =[ {
    title: 'p1',
    desc: 'lorem',
    categories: 'equipment',
    price: 1000,
},
{
    title: 'p2',
    desc: 'lor',
    categories: 'equipment',
    price: 100,
},
{
    title: 'p3',
    desc: 'lor',
    categories: 'supplement',
    price: 10,
},
{
    title: 'p4',
    desc: 'lor',
    categories: 'coach',
    price: 1,
},
]

let Product = require('./Product');

// Insert many documents
Product.insertMany(product)
.then(() => console.log('Many products are saved'))
.catch((error) => console.log(error.message));
