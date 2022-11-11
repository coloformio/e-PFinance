const mongoose = require('mongoose');

const reqString = {type: String, required: true};

const UserSchema = new mongoose.Schema({
    name: reqString,
    surname: reqString,
    username: reqString,
    email: reqString,
    password: reqString,
    balance: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: true
    }
},{collection : 'users'});

const User = mongoose.model('User', UserSchema);
module.exports = User;