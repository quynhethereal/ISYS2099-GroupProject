const mongoose = require('mongoose');
const {CategoryTree} = require('../helpers/category_tree.structure');
const Product = require('../models/product.model');

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
    subcategoriesArray: {
        type: [Number],
        index: 1
    },
    subcategories: [],
    attributes: [{
        description: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }, 
        type: {
            type: String, 
            required: true
        }
    }]   // Array of attribute documents
}, {autoIndex: true, _id: false});

const Category = mongoose.model('Category', CategorySchema);
const Sequence = mongoose.model('Sequence', SequenceSchema);

const isExistedCat = async (id) => {
    try {
        const findCat = await Category.findOne({
            $or: [
                {id: id},
                {subcategoriesArray: {$elemMatch: {$eq: id}}}
            ]
        });

        if (findCat == null) {
            return false;
        } 

        return true;
    } catch (err) {
        throw new Error('Could not find category');
    }
}

const findAll = async () => {
    try {
        const categories = await Category.find({});
        return categories;  
    } catch (error) {
        throw new Error("Error finding categories.");
    }
};

const findOne = async (id) => {
    try {
        const findCat = await Category.findOne({
            $or: [
                {id: id},
                {subcategoriesArray: {$elemMatch: {$eq: id}}}
            ]
        });

        if (findCat == null) {
            throw new Error("Category is not existed.");
        }

        const info = await findName(findCat, id);

        if (info === null) {
            throw new Error('Invalid category info.');
        }

        // Get attributes
        const categoryNode = new CategoryTree();
        categoryNode.buildTree(findCat);

        const dataSet = categoryNode.getNodeAttributes(categoryNode.searchNode(id));
        const result = new Set();

        for (const data of dataSet) {
            if (!result.has(data)) {
                result.add(data);
            }
        }

        const attributes = Array.from(result);

        const data = {
            id: id,
            name: info.name,
            parentId: info.parentId,
            attributes: attributes
        }

        return data;

    } catch (err) {
        throw new Error('Could not find category.');
    }
}


const findAttributes = async (id) => {
    try {
        const findCat = await Category.findOne({
            $or: [
                {id: id},
                {subcategoriesArray: {$elemMatch: {$eq: id}}}
            ]
        });

        if (findCat == null) {
            throw new Error("Category is not existed.");
        }

        const categoryNode = new CategoryTree();
        categoryNode.buildTree(findCat);
        
        const dataSet = categoryNode.getNodeAttributes(categoryNode.searchNode(id));

        const result = new Set();

        for (const data of dataSet) {
            if (!result.has(data)) {
                result.add(data);
            }
        }

        return Array.from(result);
    } catch (err) {
        throw new Error("Error getting attributes by id.");
    }
}

const findProductCatId = async (id) => {
    try {
        const product = await Product.findById(id);

        if (!product) {
            throw new Error('Product Id not found.')
        }

        const productCatId = parseInt(product.category_id);

        if (!productCatId) {
            throw new Error('Product Category Id not found.')
        }

        const data = await findAttributes(productCatId);

        return data;
    } catch (err) {
        throw new Error("Error getting category id by  product id.");
    }
}

module.exports = {Category, Sequence, isExistedCat, findAll, findOne, findAttributes, findProductCatId};