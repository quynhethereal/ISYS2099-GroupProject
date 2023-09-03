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
}, {autoIndex: true});

const MetaSchema = new mongoose.Schema ({
    id: {
        type: Number,
        required: true, 
        unique: true,
        index: 1
    },
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, {autoIndex: true});

const Category = mongoose.model('Category', CategorySchema);
const Sequence = mongoose.model('Sequence', SequenceSchema);
const CategoryMeta = mongoose.model('CategoryMeta', MetaSchema);

const generateID = async (model) => {
    try {
        const doc = await Sequence.findOneAndUpdate (
            {_id: model},      // Define the model that need to adjust ID value
            {$inc: {sequence : 1}}, // Increase ID by 1
            {new: true, upsert: true}
        )
        return doc.sequence;
    } catch (err) {
        console.error('Error generate id for category:', err);
    }

};

const generateMeta = async (id, name) => {
    try {
        if (!id || !name) {
            throw new Error('Id or Name of metadata is empty.');
        }

        const data = new CategoryMeta ({
            id: id, 
            name: name
        });

        await data.save();
    } catch (err) {
        console.log('Error generating metadata for Category:', err);
    }
}

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

const findDuplicateName = async (category, name) => {
    try {
        if (category.name == name) {
            return true;
        }

        if (category.subcategories) {
            for (const subcategory of category.subcategories) {
                const duplicate = await findDuplicateName(subcategory, name);

                if (duplicate) {
                    return true;
                }
            }
        }
        return false;
    } catch (err) {
        throw new Error('Could not find category name.');
    }
}

// handle cat
const createCategory = async (catObj) => {
    try {
        const categories = await Category.find();

        for (const category of categories) {
            const duplicate = await findDuplicateName(category, catObj.name);

            if (duplicate) {
                throw new Error('Category is existed');
            }
        }

        // Handle generate ID
        const nextId = await generateID('category'); 

        const attributes = catObj.attributes.map((description) => {
            let type;
            if (typeof description === 'string') {
                type = 'string';
            } else if (typeof description === 'number') {
                type = 'number';
            } else {
                throw new Error('Invalid attributes.');
            }

            return {
                description: description,
                type: type
            }
        })

        const data = new Category ({
            id: nextId,
            name: catObj.name,
            attributes: attributes
        });

        await data.save();

        return data;
    } catch (err) {
        console.log('err',err);
        throw new Error('Could not create new category');
    }
}

const createSubcategory = async (catObj) => {
    try {
        const categories = await Category.find();

        for (const category of categories) {
            const duplicate = await findDuplicateName(category, catObj.name);

            if (duplicate) {
                throw new Error('Subcategory is existed');
            }
        }

        const nextId = await generateID('category'); 

        const parentId = catObj.parentId;

        const findCat = await Category.findOne({
            $or: [
                {id: parentId},
                {subcategoriesArray: {$elemMatch: {$eq: parentId}}}
            ]
        });

        if (findCat == null) {
            throw new Error("Category parent ID is not existed.");
        }

        const attributes = catObj.attributes.map((description) => {
            let type;
            if (typeof description === 'string') {
                type = 'string';
            } else if (typeof description === 'number') {
                type = 'number';
            } else {
                throw new Error('Invalid attributes.');
            }

            return {
                description: description,
                type: type
            }
        })

        const request = {
            id: nextId, 
            parentId: parentId,
            name: catObj.name,
            attributes: attributes
        }

        findParentAndUpdate(findCat, request);

        findCat.markModified('subcategories'); // Mark as subcategories modified - needed for nested object

        findCat.subcategoriesArray.push(nextId);

        await findCat.save();

        return ({
            newCategory: request,
            category: findCat
        });
    } catch (err) {
        throw new Error ('Could not create new subcategory');
    }
}

const findParentAndUpdate = async (category, request) => {
    try {
        if (category.id === request.parentId) {
            category.subcategories.push(request);
            return;
        }

        for (const subcategory of category.subcategories) {
            findParentAndUpdate(subcategory, request);
        }
    } catch (err) {
        throw new Error('Could not create new subcategory by update category');
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

const findName = async (category, id) => {
    try {
        if (category.id == id) {
            return ({
                name: category.name,
                parentId: category.parentId, 
            })
        }

        if (category.subcategories) {
            for (let i = 0; i < category.subcategories.length; i++) {
                const subcategory = category.subcategories[i];
                const result = await findName(subcategory, id);

                if (result) {
                    return result;
                }
            }
        }
    } catch (err) {
        throw new Error("Error getting category by id.");
    }
}

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

        return Array.from(dataSet);
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

const updateCategoryData = async (catObj) => {
    try {
        const categories = await Category.find();

        for (const category of categories) {
            const duplicate = await findDuplicateName(category, catObj.name);

            if (duplicate) {
                throw new Error('Subcategory is existed');
            }
        }

        const id = catObj.id;

        const findCat = await Category.findOne({
            $or: [
                {id: id},
                {subcategoriesArray: {$elemMatch: {$eq: id}}}
            ]
        });

        if (findCat == null) {
            throw new Error("Category parent ID is not existed.");
        }

        const attributes = catObj.attributes.map((description) => {
            let type;
            if (typeof description === 'string') {
                type = 'string';
            } else if (typeof description === 'number') {
                type = 'number';
            } else {
                throw new Error('Invalid attributes.');
            }

            return {
                description: description,
                type: type
            }
        })

        const request = {
            id: id, 
            name: catObj.name,
            attributes: attributes
        }

        findIDAndUpdate(findCat, request);

        findCat.markModified('subcategories'); // Mark as subcategories modified - needed for nested object

        await findCat.save();

        return ({
            updateCategory: request,
            category: findCat
        });
    } catch (err) {
        throw new Error ('Could not update subcategory');
    }
}

const findIDAndUpdate = async (category, request) => {
    try {
        if (category.id === request.id) {
            category.name = request.name,
            category.attributes = request.attributes;
            return;
        }

        for (const subcategory of category.subcategories) {
            findIDAndUpdate(subcategory, request);
        }
    } catch (err) {
        throw new Error('Could not create new subcategory by update category');
    }
}

module.exports = {Category, Sequence, CategoryMeta, generateID, generateMeta, isExistedCat, createCategory, createSubcategory, findAll, findOne, findAttributes, findProductCatId, updateCategoryData};