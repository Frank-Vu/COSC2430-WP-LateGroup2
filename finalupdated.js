// Display customer products
app.get('/Customer/:id/product-details/:product_id', (req, res) => {
    const customer_id = req.params.id;
    const product_id = req.params.product_id;
    Product.findById(product_id)
        .then((product) => {
           
            User.findById(customer_id)
                .then((user) => {
                    res.render('product-details', { product, user, customer_id });
                })
                .catch((error) => {
                    console.log(error.message);
                });
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Display all products
app.get('/Customer/:customer_id/product-page', (req,res)=>{
    Product.find({})
    .then((products)=>{
        const customer_id = User.findById(req.params.customer_id)
        .then((customer_id)=>{
            res.render('product-page', {products, customer_id: customer_id});
        })
    })
    .catch((error)=>console.log(error.message));
});
  
  

// Get the shopping cart items for a customer
app.get('/Customer/:customer_id/shopping-cart', async (req, res) => {
    try {
        const customer_id = req.params.customer_id;
        const cartItems = await Cart.find({ customer_id: customer_id });
        res.render('shopping-cart', { cartItems, customerId: customer_id });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error fetching cart items' });
    }
});

// Add a product to the shopping cart
app.post('/add-to-cart', (req, res) => {
    const customer_id = req.query.customer_id;
    const product_id = req.query.product_id;

  Product.findById(product_id)
      .then((product) => {
          const cartItem = new Cart({
              customer_id: customer_id,
              vendor_id: product.vendor_id,
              name: product.name,
              price: product.price,
              image: product.image,
              description: product.description
          });

          cartItem.save()
              .then(() => {
                  res.redirect(`/Customer/${customer_id}/shopping-cart`);
              })
              .catch((error) => {
                  console.log(error.message);
              });
      })
      .catch((error) => {
          console.log(error.message);
      });
});

// Remove an item from the shopping cart
app.post('/Customer/:customer_id/remove-from-cart/:product_id', async (req, res) => {
    try {
        await Cart.findOneAndDelete({ customer_id: req.params.customer_id, product_id: req.params.product_id });
        res.redirect(`/Customer/${req.params.customer_id}/shopping-cart`);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error removing item from cart' });
    }
});


// Place an order
app.post('/Customer/:id/place-order', (req, res) => {
  Cart.find({ customer_id: req.params.id })
      .then(async (cartItems) => {
          const orderItems = cartItems.map((item) => {
              return new OrderItem({
                  product_id: item.product_id,
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                  image: item.image,
                  description: item.description
              });
          });

          const totalPrice = orderItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

          const customer = await User.findById(req.params.id);

          const order = new Order({
              customer_id: req.params.id,
              shipper_id: req.params.id,
              distribution_hub: customer.distribution_hub,
              status: 'active',
              total_price: totalPrice,
              items: orderItems,
              address: customer.address
          });

          await order.save();

          await Cart.deleteMany({ customer_id: req.params.id });

          res.redirect(`/Customer/${req.params.id}/shopping-cart`);
      })
      .catch((error) => {
          console.log(error.message);
      });
});

// Display active orders for shippers
app.get('/Shipper/:id/orders', (req, res) => {
    const shipper_id = req.params.id;
  Order.find({ status: 'active' })
      .then((orders) => {
          res.render('shipper-page', { orders, shipper_id });
      })
      .catch((error) => {
          console.log(error.message);
      });
});

// Update the order status
app.post('/Shipper/:shipper_id/update-order/:order_id', (req, res) => {
  const newStatus = req.body.status;

  Order.findByIdAndUpdate(req.params.order_id, { status: newStatus })
      .then(() => {
          res.redirect(`/Shipper/${req.params.shipper_id}/orders`);
      })
      .catch((error) => {
          console.log(error.message);
      });
});