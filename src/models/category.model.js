const mongoose = require('mongoose');

const SequenceSchema = new mongoose.Schema({
    _id: String, 
    sequence: {
        type: Number, 
        default: 0
    }
});

const CategorySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true, 
        unique: true
    },
    parentId: {
        type: Number
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    subcategories: [],
    attributes: [{
        description: {
            type: String,
            required: true
        }, 
        type: {
            type: String, 
            required: true
        }
    }]   // Array of attribute documents
}, {autoIndex: false});

CategorySchema.add({subcategories: [CategorySchema]});

const Category = mongoose.model('Category', CategorySchema);
const Sequence = mongoose.model('Sequence', SequenceSchema);

// Category.collection.drop();
// Sequence.collection.drop();

module.exports = {Category, Sequence};