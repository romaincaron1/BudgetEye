const mongoose = require('mongoose');

const Type = mongoose.model('Type', new mongoose.Schema({
    name: {
        type: String,
    },
    color: {
        type: String,
    },
    treshold: {
        type: Number,
    },

}));

exports.Type = Type;