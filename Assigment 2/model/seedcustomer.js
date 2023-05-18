const customer = [{
    name: 'dat',
    email:'bruh@gmail.com',
    password: 'lol'
},
{
    name: 'minh',
    email:'bruh1@gmail.com',
    password: 'lol'
},{
    name: 'long',
    email:'bruh2@gmail.com',
    password: 'lol'
},{
    name: 'tung',
    email:'bruh3@gmail.com',
    password: 'lol'
},
]

let Customer = require('./Customer');

// Insert many documents
Customer.insertMany(customer)
.then(() => console.log('Many products are saved'))
.catch((error) => console.log(error.message));