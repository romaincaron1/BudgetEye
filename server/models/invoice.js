const mongoose = require('mongoose');

const Invoice = mongoose.model('Invoices', new mongoose.Schema({
    image_url: {
        type: String,
    },
    title: {
        type: String,
    },
    date: {
        type: Date,
    },
    total_ttc: {
        type: Number,
    },
    archived: {
        type: Boolean,
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
    },

}));

exports.Invoice = Invoice;