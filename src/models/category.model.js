const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const SequenceSchema = new mongoose.Schema({
    _id: String, 
    sequence: {
        type: Number, 
        default: 0
    }
});

const SubcategorySchema = new mongoose.Schema({
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

const Subcategory = mongoose.model('Subcategory', SubcategorySchema);

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
    subcategories: [SubcategorySchema],
    attributes: [{
        description: {
            type: String,
            required: true
        }, 
        type: {
            type: String, 
            required: true
        }
    }]  
}, {autoIndex: false});

const Category = mongoose.model('Category', CategorySchema);
const Sequence = mongoose.model('Sequence', SequenceSchema);

// Category.collection.drop();
// Subcategory.collection.drop();
// Sequence.collection.drop();

module.exports = {Category, Subcategory, Sequence};