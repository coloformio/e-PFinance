const mongoose = require('mongoose');

const reqString = {type: String, required: true};

const OperationSchema = new mongoose.Schema({
    username: reqString,
    type: reqString,
    title: reqString,
    description: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    dateOp: {
        type: Date,
        required: true
    },
    category: reqString
}, {collection: 'operations'});

const Operation = mongoose.model('Operation', OperationSchema);
module.exports = Operation;
