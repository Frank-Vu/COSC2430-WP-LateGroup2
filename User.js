const mongoose = require('mongoose');
const {boolean} = require('webidl-conversions');

const userSchema = new mongoose.Schema(
    {
        username: {type: String, requires: true, unique:true},
        email: {type: String, requires: true, unique:true},
        password: {type: String, requires: true},
        isAdmin:{
            type: boolean,
            default: false,
        },
    },{timestamps:true}
);

module.exports= mongoose.model('User', userSchema);
