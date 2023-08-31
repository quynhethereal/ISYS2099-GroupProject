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
        unique: true,
        index: 1
    },
    parentId: {
        type: Number
    },
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
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
}, {autoIndex: true, _id: false});

CategorySchema.index({id: 1, subcategories: 1}, {unique: true});

const Category = mongoose.model('Category', CategorySchema);
const Sequence = mongoose.model('Sequence', SequenceSchema);

// Category.collection.drop();
// Sequence.collection.drop(); 

module.exports = {Category, Sequence};