const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


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

//Render 'create-acc.ejs' as home page.
app.get('/', (req, res) => {
    res.render('create-acc');
});

//Render 'login.ejs' as login page.
app.get('/login', (req, res) => {
    res.render('login');
});

//Render 'C_home.ejs' as customer page.
app.get('/customer', (req, res) => {
    res.render('C_home');
});

//Render 'S_home.ejs' as shipper page.
app.get('/shipper', (req, res) => {
    res.render('S_home');
});

//Render 'V_home.ejs' as vendor page.
app.get('/vendor', (req, res) => {
    res.render('V_home');
});




//------------------Schemas:----------------------
//customer Schema:
const customerSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    address: String,
    profilePicture: Buffer,
});

//Shipper Schema:
const shipperSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    dis_hub: String,
    profilePicture: Buffer,
});

//Vendor Schema:
const vendorSchema = new mongoose.Schema({
    username: String,
    password: String,
    b_name: String,
    b_address: String,
    profilePicture: Buffer,
});
//------------------------------------------------

const Customer = mongoose.model('Customer', customerSchema);
const Shipper = mongoose.model('Shipper', shipperSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);

//--------------Registration form:--------------------
//Customer register:
app.post('/register-customer', async (req, res) => {
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
            .catch((error) => {
                res.send('Something is wrong');
            })
        res.send('Registration complete!')

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
            .catch((error) => {
                res.send(error.message);
            })
        res.redirect('/login');

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
            .catch((error) => {
                res.send('Something is wrong');
            })
        res.send('Registration complete!')

    } catch (error) {
        res.send('Something is definitely wrong');
    }
});




//-----------Login form---------------------
app.post('/login/success', async (req, res) => {
    try {
        const customer = await Customer.findOne({ username: req.body.username });
        if (customer) {
            const result = bcrypt.compare(req.body.password, customer.password);
            if (result) {
                console.log('Login SUCCESS as Customer!');
                return res.redirect('/customer');
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