const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');


//Connect to MongoDB database USERS
mongoose.connect('mongodb+srv://khaiminh2001:minh123@bing-chilling.nrj7j40.mongodb.net/USERS?retryWrites=true&w=majority')
    .then(() => {
        console.log(`Connection established!`);
    })
    .catch((error) => {
        console.log(error.message);
    });

//Use 'express.urlencoded' middleware to parse incoming data:
app.use(express.urlencoded({ extended: true }));

//Render ejs files:
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Use express-fileupload to handle upload files:
app.use(fileUpload());

//Render 'create-acc.ejs' as home page.
app.get('/', (req, res) => {
    res.render('create-acc');
});

//Render 'login.ejs' as login page.
app.get('/login', (req, res) => {
    res.render('login');
});

//Render 'shopping-cart.ejs' as Cart page.
app.get('/cart', (req, res) => {
    res.render('shopping-cart');
});

//Render 'product-detail.ejs' as product detail page.
app.get('/product-detail', (req, res) => {
    res.render('product-detail');
});

//---------------------------Shipping list:----------------------------
app.get('/Shipper/shipping-list', (req, res) => {
    res.render('shipper');
});

//-----------------Render My Account page with data based on the user's:-----------------
//For customer:
app.get('/Customer/:id', (req, res) => {
    User.find(req.params.id)
        .then((user) => {
            res.render('C_myaccount', { user });
        })
        .catch((error) => {
            console.log(error.massage);
        });
});

//For shipper:
app.get('/Shipper/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            res.render('S_myaccount', { user });
        })
        .catch((error) => {
            console.log(error.massage);
        });
});

//For vendor:
app.get('/Vendor/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            res.render('V_myaccount', { user });
        })
        .catch((error) => {
            console.log(error.massage);
        });
});


//Logout:
app.post('/logout', (req, res) => {
    res.redirect('/login');
});
//--------------------------------------------------------------------------------------

//------------------Schemas:----------------------
//User information:
const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        minlength: 8,
        maxlength: 15,
        match: /^[a-zA-Z0-9]+$/, //Using 'match' to specify allowed characters in Username, in this case: every letters and numbers.
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 20,
        match: /^[a-zA-Z0-9!@#$%^&*]+$/, //Password only allows letters, digits and !@#$%^&*.
        required: true
    },
    full_name: {
        type: String,
        minlength: 5,
    },
    address: {
        type: String,
        minlength: 5,
    },
    distribution_hub: {
        type: String,
    },
    business_name: {
        type: String,
        minlength: 5,
    },
    business_address: {
        type: String,
        minlength: 5,
    },
    profilePicture: {
        data: Buffer,
        mimeType: String,
    }
});
//----------------------

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

//Shopping cart:
const cartSchema = new mongoose.Schema({
    customer_id: String,
    vendor_id: String,
    name: String,
    price: String,
    image: {
        data: Buffer,
        mimeType: String,
    },
    description: String
});

//Shipping list:
const shippingSchema = new mongoose.Schema({
    product_id: String,
    product_name: String,
    product_price: String,
    product_img: {
        data: Buffer,
        mimeType: String
    },
    customer_name: String,
    customer_address: String
});

const orderedItemSchema = new mongoose.Schema({
    product_id: String,
    name: String,
    price: String,
    quantity: Number,
    image: {
        data: Buffer,
        mimeType: String,
    },
    description: String
});

const orderSchema = new mongoose.Schema({
    customer_id: String,
    shipper_id: String,
    distribution_hub: String,
    status: String,
    total_price: Number,
    items: [orderedItemSchema],
    address: String
});



//------------------------------------------------

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
//experimental:
const Order = mongoose.model('Order', orderSchema);
const OrderItem = mongoose.model('OrderItem', orderedItemSchema);

//--------------Registration form:--------------------
//User register:
app.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hasedPASS = await bcrypt.hash(req.body.password, salt);  //Hashing (encrypting) password with Bcrypt.

        const user = new User({
            role: req.body.role,
            username: req.body.username,
            password: hasedPASS,         //Storing the hased password. 
            full_name: req.body.full_name,
            address: req.body.address,
            distribution_hub: req.body.distribution_hub,
            business_name: req.body.business_name,
            business_address: req.body.business_address,
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype
            }
        });

        await user.save()  //Save the data into the User collection.
            .then(() => {
                res.redirect('/login');  //Redirect the user to the login page.
            })
            .catch((error) => {
                console.log(error.message);
            });

    } catch (error) {
        console.log(error.message);
    }
});


//-----------Login form---------------------
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const result = bcrypt.compare(req.body.password, user.password);   //Use bcrypt to decrypt the password inside the database and compare it with the inputted password.
            if (result) {
                console.log(`Login successful as ${user.role}!`);
                return res.redirect(`/${user.role}/${user.id}`);
            } else {
                return res.send('Invalid credentials!');
            }
        } else {
            return res.send('Invalid credentials!');
        }
    } catch (error) {
        console.log(error.message);
    }
});


//-----------------------------------------------------

//----------------My Account Profile Picture Update:------------
app.post('/:user_role/:user_id/pfp-update', (req, res) => {
    User.findByIdAndUpdate(req.params.user_id, {
        profilePicture: {
            data: req.files.img_change.data,
            mimeType: req.files.img_change.mimetype
        }
    }, { new: true })
        .then((updatedUser) => {
            res.redirect(`/${updatedUser.role}/${updatedUser._id}`);
        })
        .catch((error) => {
            console.log(error.message);
        })
});
//---------------------------------------------------------------















//--------------------EXPERIMENTAL!!!!!---------------------------
//Adding products:
app.post(`/Vendor/:id/products/update`, (req, res) => {
    const product = new Product({
        vendor_id: req.params.id,
        name: req.body.name,
        price: req.body.price,
        image: {
            data: req.files.image.data,
            mimeType: req.files.image.mimetype
        },
        description: req.body.description
    });
    product.save()
        .then(() => {
            console.log(`Product saved successfully!`);
            res.redirect(`/Vendor/${req.params.id}/products`);
        })
        .catch((error) => {
            console.log(error.message);
        });
});

//-----------------View products:----------------------------
app.get(`/Vendor/:id/products`, (req, res) => {
    const user = User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                console.log('Cannot find product.');
            } else if (user) {
                const product = Product.find({ vendor_id: req.params.id })
                    .then((product) => {
                        return res.render('vendor-page', { product, user });
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
});
//------------------------------------------------------

//---------Product Detail----------------
app.get('/Customer/:customer_id/product-detail/:product_id', (req, res) => {
    const product = Product.findById(req.params.product_id)
        .then((product) => {
            if (!product) {
                console.log('Cannot find product.');
            } else if (product) {
                const user = User.findById(product.vendor_id)
                    .then((user) => {
                        return res.render('product-detail', { product, user });
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
});
//---------------------------------------------------



//----------EXPERIMENTAL ORDER------------------
// Display all products
app.get('/Customer/:id/products', (req, res) => {
    Product.find()
        .then((products) => {
            res.render('customer-products', { products });
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Filter products based on name and price 
app.post('/Customer/:id/products/search', (req, res) => {
    const { minPrice, maxPrice, productName } = req.body;
    const query = {
        price: { $gte: minPrice, $lte: maxPrice },
        name: { $regex: productName, $options: 'i' },
    };

    Product.find(query)
        .then((products) => {
            res.render('customer-products', { products });
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Add a product to the shopping cart
app.post('/Customer/:customer_id/add-to-cart/:product_id', (req, res) => {
    Product.findById(req.params.product_id)
        .then((product) => {
            const cartItem = new Cart({
                customer_id: req.params.customer_id,
                vendor_id: product.vendor_id,
                name: product.name,
                price: product.price,
                image: product.image,
                description: product.description
            });

            cartItem.save()
                .then(() => {
                    res.redirect(`/Customer/${req.params.customer_id}/products`);
                })
                .catch((error) => {
                    console.log(error.message);
                });
        })
        .catch((error) => {
            console.log(error.message);
        });
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
                shipper_id: null,
                distribution_hub: customer.distribution_hub,
                status: 'active',
                total_price: totalPrice,
                items: orderItems,
                address: customer.address
            });

            await order.save();

            await Cart.deleteMany({ customer_id: req.params.id });

            res.redirect(`/Customer/${req.params.id}/orders`);
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Display active orders for shippers
app.get('/Shipper/:id/orders', (req, res) => {
    Order.find({ shipper_id: req.params.id, status: 'active' })
        .then((orders) => {
            res.render('shipper-orders', { orders });
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
//--------------------------------------------------  




//Listening to port: 3000.
app.listen(3000, () => {
    console.log('Listening at port 3000.')
});


//BACKUP / UNUSABLE CODES

//app.post('/login/success', (req, res) => {
//    Customer.findOne({
//       username: req.body.username,
//        password: req.body.password
//    })
//        .then(customer => {
//            if (!customer) {
//                return res.send('Request not found.');
//            }
//            res.redirect('/customer');
//        })
//        .catch(error => res.send(error.message));
//});

/* app.post('/login/success', (req, res) => {
    Customer.findOne({ username: req.body.username, password: req.body.password })
        .then(customer => {
            
            if (!customer) {
                Shipper.findOne({ username: req.body.username, password: req.body.password })
                    .then(shipper => {
                        
                        if (!shipper) {
                            Vendor.findOne({ username: req.body.username, password: req.body.password })
                                .then(vendor => {
                                    if (!vendor) {
                                        return res.send('Request not found.');
                                    }
                                    res.redirect('/vendor');
                                })
                            res.redirect('/shipper');
                        }
                    })
            }
            res.redirect('/customer');
        })
        .catch(error => res.send(error.message));
}); */


/* //--------------Registration form:--------------------
//Customer form:
app.post('/register-customer', (req, res) => {
    const customer = new Customer(req.body);
    customer.save()
        .then((customer) => res.send(customer))
        .catch((error) => res.send(error));
});

//Shipper form:
app.post('/register-shipper', (req, res) => {
    const shipper = new Shipper(req.body);
    shipper.save()
        .then((shipper) => res.send(shipper))
        .catch((error) => res.send(error));
});

//Vendor form:
app.post('/register-vendor', (req, res) => {
    const vendor = new Vendor(req.body);
    vendor.save()
        .then((vendor) => res.send(vendor))
        .catch((error) => res.send(error));
});
//--------------------------------------------------- */

/* //-----------Login form---------------------
app.post('/login/success', (req, res) => {
    Customer.findOne({ username: req.body.username, password: req.body.password })
        .then(customer => {
            if (customer) {
                res.redirect('/customer');
            } else {
                Shipper.findOne({ username: req.body.username, password: req.body.password })
                    .then(shipper => {
                        if (shipper) {
                            res.redirect('/shipper');
                        } else {
                            Vendor.findOne({ username: req.body.username, password: req.body.password })
                                .then(vendor => {
                                    if (vendor) {
                                        res.redirect('/vendor');
                                    } else {
                                        return res.send('Could not find matching data!')
                                    }
                                })
                        }
                    })
            }
        })
        .catch(error => {
            console.log(error.message);
        })
});
//----------------------------------------------------- */

/* app.post('/register-customer', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hasedPASS = await bcrypt.hash(req.body.password, salt);
        const customer = new Customer({
            username: req.body.username,
            password: hasedPASS,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            profilePicture: req.body.profilePicture,
        });
        customer.save()
            .then(() => {
                res.redirect('/login');
            })
            .catch((error) => {
                console.log(error.message);
            });

    } catch (error) {
        res.send('Something is definitely wrong');
    }
});

//Shipper register:
app.post('/register-shipper', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hasedPASS = await bcrypt.hash(req.body.password, salt);
        const shipper = new Shipper({
            username: req.body.username,
            password: hasedPASS,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dis_hub: req.body.dis_hub,
            profilePicture: req.body.profilePicture,
        });
        shipper.save()
            .then(() => {
                res.redirect('/login');
            })
            .catch((error) => {
                console.log(error.message);
            });

    } catch (error) {
        res.send('Something is definitely wrong');
    }
});

//Vendor register:
app.post('/register-vendor', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hasedPASS = await bcrypt.hash(req.body.password, salt);
        const vendor = new Vendor({
            username: req.body.username,
            password: hasedPASS,
            b_name: req.body.b_name,
            b_address: req.body.b_address,
            profilePicture: req.body.profilePicture,
        });
        vendor.save()
            .then(() => {
                res.redirect('/login');
            })
            .catch((error) => {
                console.log(error.message);
            })

    } catch (error) {
        res.send('Something is definitely wrong');
    }
}); */

/* //-----------Login form---------------------
app.post('/login/success', async (req, res) => {
    try {
        const customer = await Customer.findOne({ username: req.body.username });
        if (customer) {
            const result = bcrypt.compare(req.body.password, customer.password);
            if (result) {
                console.log('Login SUCCESS as Customer!');
                return res.redirect(`/customer/${customer.id}`);
            }

        }

        const shipper = await Shipper.findOne({ username: req.body.username });
        if (shipper) {
            const result = bcrypt.compare(req.body.password, shipper.password);
            if (result) {
                console.log('Login SUCCESS as Shipper!');
                return res.redirect('/shipper');
            }
        }

        const vendor = await Vendor.findOne({ username: req.body.username });
        if (vendor) {
            const result = bcrypt.compare(req.body.password, vendor.password);
            if (result) {
                console.log('Login SUCCESS as Vendor!');
                return res.redirect('/vendor');
            }
        }
        console.log('Invalid credentials!');

    } catch (error) {
        console.log('Something is wrong!');
    }
}); */

/* app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const result = bcrypt.compare(req.body.password, user.password);   //Use bcrypt to decrypt the password inside the database and compare it with the inputted password.
            if (result) {
                if (user.role == 'Customer') {
                    console.log('Login successful as Customer!');
                    return res.redirect(`/customer/${user.id}`);
                } else if (user.role == 'Shipper') {
                    console.log('Login successful as Shipper!');
                    return res.redirect(`/shipper/${user.id}`);
                } else if (user.role == 'Vendor') {
                    console.log('Login successful as Vendor!');
                    return res.redirect(`/vendor/${user.id}`);
                } else if (error) {
                    console.log(error.message);
                }
            } else {
                return res.send('Invalid credentials!');
            }
        } else {
            return res.send('Invalid credentials!');
        }
    } catch (error) {
        console.log(error.message);
    }
}); */