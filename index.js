const express = require('express');
const app = express();
const mongoose = require('mongoose');

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
//---------------------------------------------------

//-----------Login form---------------------
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
