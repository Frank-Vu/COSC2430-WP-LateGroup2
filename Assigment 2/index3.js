const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');


//Connect to MongoDB database USERS
mongoose.connect('mongodb+srv://mandatvippro:bruh@cluster0.nzxajuv.mongodb.net/?retryWrites=true&w=majority')
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

//Render 'myaccount.ejs' as MyAccount page.
/* app.get('/myacc', (req, res) => {
    res.render('myaccount');
}); */

//-----------------Render My Account page with data based on the user's:-----------------
//For customer:
app.get('/Customer/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            res.render('myaccount', { user });
        })
        .catch((error) => {
            console.log(error.massage);
        });
});

//For shipper:
app.get('/Shipper/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            res.render('S_aboutPage', { user });
        })
        .catch((error) => {
            console.log(error.massage);
        });
});

//For vendor:
app.get('/Vendor/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            res.render('V_aboutPage', { user });
        })
        .catch((error) => {
            console.log(error.massage);
        });
});
//--------------------------------------------------------------------------------------

//------------------Schemas:----------------------
const userSchema = new mongoose.Schema({
    role: String,
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

const productSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: String, 
    price: Number,
    image: {
        data: Buffer,
        mimeType: String,
    },
    description: {
        type: String,
        maxlength: 500,
    }
}) 

const shoppingcartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}) 

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    shipper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    totalPrice: {
        type: Number,
        min: 0
    },
    deliveryAddress: {
        type: String,
        minlength: 5
    },
    status: {
        type: String,
        enum: ['active', 'delivered', 'canceled'],
        default: 'active'
    }
})

//------------------------------------------------

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Shoppingcart = mongoose.model('Shoppingcart', shoppingcartSchema);

//--------------Registration form:--------------------
//User register:
app.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hasedPASS = await bcrypt.hash(req.body.password, salt);  //Hashing (encrypting) password with Bcrypt.

        const user = new User({
            role: req.body.role,
            username: req.body.username,
            password: hasedPASS,
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

        await user.save()
            .then(() => {
                res.redirect('/login');
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

app.get('/product-details', (req,res)=>{
    Product.find({})
    .then((products) => res.render('product-details',{products}))
    .catch((error)=>{console.log(error.message)})
});


app.get('/vendor/:id/products', (req,res)=>{
    Product.find({vendor: req.params.id})
    .then((products)=>
    res.render('view-products', {products}))
    .catch((error)=>{console.log(error.message)})
});

//Add new product for Vendor
app.post('/Vendor/:id/add-product', (req, res) => {
    const product = new Product({
        vendor: req.params.id,
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
            res.redirect(`/Vendor/${req.params.id}/view-products`);
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Render 'view-all-products.ejs for Customer
app.get('/Customer/:id/view-all-products', (req, res) => {
    Product.find()
        .then((products) => {
            res.render('/view-all-products', { products });
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Filter and search products for Customer
app.post('/Customer/:id/filter-search-products', (req, res) => {
    var filter = {};
    if (req.query.category){
        filter.category = req.query.category;
    }
    if (req.query.price){
        filter.price = { $lte:req.query.price }
    }
    Product.find(filter, function(err, products){
        if (err){
            console.log(err);
            return res.status(500).send();
        }
        res.render('view-all-products', {products: products})
    });
});

// Render 'view-active-orders.ejs' for Shipper
app.get('/Shipper/:id/view-active-orders', (req, res) => {
    Order.find({ shipper: req.params.id, status: 'active' })
        .populate('products')
        .then((orders) => {
            res.render('view-active-orders', { orders })
        .catch((error) => {
            console.log(error.message)
        });
    });
});

// Render 'shopping-cart.ejs' for Customer
app.get('/Customer/:id/shopping-cart', (req, res) => {
    Shoppingcart.findOne({ customer: req.params.id })
        .populate('products')
        .then((shoppingCart) => {
            res.render('shopping-cart', { shoppingCart });
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Add product to shopping cart for Customer
app.post('/Customer/:id/add-to-cart/:productId', (req, res) => {
    Shoppingcart.findOneAndUpdate(
        { customer: req.params.id },
        { $addToSet: { products: req.params.productId } }
    )
        .then(() => {
            res.redirect(`/Customer/${req.params.id}/view-all-products`);
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Render 'checkout.ejs' for Customer
app.get('/Customer/:id/checkout', (req, res) => {
    Shoppingcart.findOne({ customer: req.params.id })
        .populate('products')
        .then((shoppingCart) => {
            res.render('checkout', { shoppingCart });
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Remove product from shopping cart for Customer
app.post('/Customer/:id/remove-from-cart/:productId', (req, res) => {
    Shoppingcart.findOneAndUpdate(
        { customer: req.params.id },
        { $pull: { products: req.params.productId } }
    )
        .then(() => {
            res.redirect(`/Customer/${req.params.id}/shopping-cart`);
        })
        .catch((error) => {
            console.log(error.message);
        });
});
//-----------------------------------------------------

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