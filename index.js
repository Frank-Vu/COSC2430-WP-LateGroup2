const { error } = require('console');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth')



mongoose
    .connect('mongodb+srv://datle:hello@cluster0.t1rzjtc.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>console.log('Connect to MongoDB Atlas'))
    .catch((error)=>console.log(error.message))


app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);



app.listen(5000,()=>{
    console.log('Backend is running')
})

