const mongoose = require('mongoose');

const listProducts = [
    {
        id: 1,
        name: 'GOLD STANDARD Weight Protein',
        price: 205,
        quantity: 0,
        image: 'img1.jpg',
        nature: {
            type: 'WP'
        }
    },
    {
        id: 2,
        name: 'RULE1 Weight Protein',
        price: 300,
        quantiy: 30,
        image: 'img2.jpg',
        nature: {
            type: 'WP'
        }
    },
    {
        id: 3,
        name: 'Blend Vegan Protein',
        price: 200,
        quantiy: 30,
        image: 'img3.jpg',
        nature: {
            type: 'VP'
        }
    },
    {
        id: 4,
        name: 'GOLD OAT MILK Vegan Protein',
        price: 400,
        quantiy: 30,
        image: 'img4.jpg',
        nature: {
            type: 'VP'
        }
    },
    {
        id: 5,
        name: 'Chocolate Protein Bar',
        price: 320,
        quantiy: 30,
        image: 'img5.jpg',
        nature: {
            type: 'PB'
        }
    },
    {
        id: 6,
        name: 'Brownie Protein Bar',
        price: 100,
        quantiy: 30,
        image: 'img6.jpg',
        nature: {
            type: 'PB'
        }
    },

];

let Product = require('./Product');

Product.insertMany(listProducts)
.then(()=>console.log('Many are saved'))
.catch((error)=>console.log(error.message));