const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(express.json());

// Show the homepage
app.get('/', (req, res) => {
    res.render('index');
  });
  
  
  // CREATE - Show create product form
  app.get('/product/new', (req, res) => {
    res.render('create-product');
  });
  
  // CREATE - Create a new product
  app.post('/product', (req, res) => {
    console.log(req.body);
    const product = new Product(req.body);
    product.save()
      .then(() => res.redirect('/products'))
      .catch(error => res.send(error));
  });
  
  // READ - Get all products
  app.get('/products', (req, res) => {
    Product.find({})
      .then(products => res.render('view-products', { products }))
      .catch(error => res.send(error));
  });
  
  // UPDATE - Show update product form
  app.get('/product/:id/update', (req, res) => {
    Product.findById(req.params.id)
      .then(product => {
        if (!product) {
          return res.send('Not found any product matching the ID!');
        }
        res.render('update-product', { product });
      })
      .catch(error => res.send(error));
  });
  
  
  // UPDATE - Update a product by ID
  app.post('/product/:id/update', (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'price', 'description', 'onSale', 'categories'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.send({ error: 'Invalid updates!' });
    }
  
    Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
      .then(product => {
        if (!product) {
          return res.send('Not found any product matching the ID!');
        }
        res.redirect('/products');
      })
      .catch(error => res.send(error));
  });
  
  // DELETE - Show delete product form
  app.get('/product/:id/delete', (req, res) => {
    Product.findById(req.params.id)
      .then(product => {
        if (!product) {
          return res.send('Not found any product matching the ID!');
        }
        res.render('delete-product', { product });
      })
      .catch(error => res.send(error));
  });
  
  // DELETE - Delete a product by ID
  app.post('/product/:id/delete', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
      .then(product => {
        if (!product) {
          return res.send('Not found any product matching the ID!');
        }
        res.redirect('/products');
      })
      .catch(error => res.send(error));
  });

app.listen(3000,()=>{
    console.log('Backend is running')
})

