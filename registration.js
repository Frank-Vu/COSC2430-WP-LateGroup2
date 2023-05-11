const mongoose = require('mongoose');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.json())

// Use the `express.urlencoded` middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://mandatvippro:bruh@cluster0.h9fbwla.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log('Connect to MongoDB Atlas'))
.catch((error)=>console.log(error.message))

var db =mongoose.connection;

app.get('/', (req,res)=>{
    res.set({
        "ALLow-access-ALLow-Origin": '*'
    })
})

app.post('/registrationvendor', (req, res)=>{
    var username = req.body.username;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;

    var data ={
        'Username': username,
        "Email": email,
        'Phone Number': phone,
        'Password': password
    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log('Your record has been saved')
    });
    return res.redirect('/registrationvendor')
})

app.post('/registrationuser', (req, res)=>{
    var username = req.body.username;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;

    var data ={
        'Username': username,
        "Email": email,
        'Phone Number': phone,
        'Password': password
    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log('Your record has been saved')
    });
    return res.redirect('/registrationuser')
})

app.post('/registrationshipper', (req, res)=>{
    var username = req.body.username;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;

    var data ={
        'Username': username,
        "Email": email,
        'Phone Number': phone,
        'Password': password
    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log('Your record has been saved')
    });
    return res.redirect('/registrationshipper')
})

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})