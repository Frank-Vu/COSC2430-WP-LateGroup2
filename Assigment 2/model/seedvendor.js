const vendor = [{
    name: 'keit',
    email:'lol@gmail.com',
    password: 'bruh'
},
{
    name: 'minhminh',
    email:'bruh100@gmail.com',
    password: 'lollol'
},{
    name: 'longphung',
    email:'bruh2000@gmail.com',
    password: 'lollolll'
},{
    name: 'datle',
    email:'bruh300@gmail.com',
    password: 'bruhburh'
},
]

let Customer = require('./Customer');

// Insert many documents
Customer.insertMany(customer)
.then(() => console.log('Many products are saved'))
.catch((error) => console.log(error.message));