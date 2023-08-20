const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema ({
    id: {
        type: Number, 
        required: true, 
        unique: true
    },
    name: {
        type: String, 
        required: true,
        unique: true
    },
    attributes: [String],
    parent: Number
}, {autoIndex: false});

module.exports = mongoose.model('Category', CategorySchema);