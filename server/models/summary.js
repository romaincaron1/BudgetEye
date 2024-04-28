const mongoose = require('mongoose');

const Summary = mongoose.model('Summary', new mongoose.Schema({
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    },
    generated_date: {
        type: Date,
    },
    pdf_link: {
        type: String,
    },

}));

exports.Summary = Summary;