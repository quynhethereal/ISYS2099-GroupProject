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
        name: String, 
        value: {
            description: {
                type: mongoose.Schema.Types.Mixed,
            }, 
            type: {
                type: String, 
                enum:['string','number'],
            }
        },
        required: {
            type: Boolean,
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

const findDuplicateName = async (category, name, id) => {
    try {
        if (category.name == name && category.id !== id) {
            return true;
        }

        if (category.subcategories) {
            for (const subcategory of category.subcategories) {
                const duplicate = await findDuplicateName(subcategory, name, id);

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
        console.log('catObj', catObj);
        const categories = await Category.find();

        for (const category of categories) {
            const duplicate = await findDuplicateName(category, catObj.name, 0);

            if (duplicate) {
                throw new Error('Category is existed');
            }
        }

        // Handle generate ID
        const nextId = await generateID('category'); 

        // attributes include name, required status, description
        const attributes = catObj.attributes.map((attribute) => {
            console.log('attribute', attribute);
            if (attribute.name == null) {
                throw new Error('Empty attribute name.');
            }

            if (!attribute.required) {
                return {
                    name: attribute.name,
                    required: attribute.required
                }
            }

            const description = attribute.value;

            let type;
            if (typeof description === 'string') {
                type = 'string';
            } else if (typeof description === 'number') {
                type = 'number';
            } else {
                throw new Error('Invalid attributes.');
            }

            return {
                name: attribute.name, 
                required: attribute.required,
                value: {
                    description: description,
                    type: type
                } 
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
            const duplicate = await findDuplicateName(category, catObj.name, 0);

            if (duplicate) {
                console.log('Subcategory is existed');
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

        const attributes = catObj.attributes.map((attribute) => {
            if (attribute.name == null) {
                throw new Error('Empty attribute name.');
            }

            if (!attribute.required) {
                return {
                    name: attribute.name,
                    required: attribute.required
                }
            }

            const description = attribute.value;

            let type;
            if (typeof description === 'string') {
                type = 'string';
            } else if (typeof description === 'number') {
                type = 'number';
            } else {
                throw new Error('Invalid attributes.');
            }

            return {
                name: attribute.name, 
                required: attribute.required,
                value: {
                    description: description,
                    type: type
                } 
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
const findNestedSubcategories = async (category) => {
    const catObj = {
        id: category.id,
        parentId: category.parentId,
        name: category.name
    };

    const data = [];
    data.push(catObj);

    if (category.subcategories && category.subcategories.length > 0) {
        
        const subcategories = await Promise.all(category.subcategories.map((subcategory) => (findNestedSubcategories(subcategory))));

        for (const subcategory of subcategories) {
            data.push(...subcategory);
        }
    }
    console.log(data);

    return data;
}

const findAllFlatten = async () => {
    try {
        const categories = await Category.find({});
        const data = [];

        for (const category of categories) {
            const catObj = await findNestedSubcategories(category);
            data.push(...catObj);
        }

        return data;
    } catch (err) {
        throw new Error("Error fetching id and name of categories and subcategories.", err);
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
            console.log('Category not found!');
            throw new Error("Category not found!");
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
            console.log('Product Id not found!');
            throw new Error('Product Id not found.')
        }

        const productCatId = parseInt(product.category_id);

        if (!productCatId) {
            console.log('Product Category Id not found!');
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

        const id = catObj.id;

        // Handle duplicate name with itself
        for (const category of categories) {
            const duplicate = await findDuplicateName(category, catObj.name, id);

            if (duplicate) {
                console.log('Category name is existed!');
                throw new Error('Category name is existed');
            }
        }

        const findCat = await Category.findOne({
            $or: [
                {id: id},
                {subcategoriesArray: {$elemMatch: {$eq: id}}}
            ]
        });

        if (findCat == null) {
            throw new Error("Category parent ID is not existed.");
        }

        const count = await Product.countByCategory(id);

        if (count > 0) {
            console.log('Products remain in category!');
            throw new Error('Products remain in category!');
        }

        const attributes = catObj.attributes.map((attribute) => {
            console.log('attribute', attribute);
            if (attribute.name == null) {
                throw new Error('Empty attribute name.');
            }

            if (!attribute.required) {
                return {
                    name: attribute.name,
                    required: attribute.required
                }
            }

            const description = attribute.value;

            let type;
            if (typeof description === 'string') {
                type = 'string';
            } else if (typeof description === 'number') {
                type = 'number';
            } else {
                throw new Error('Invalid attributes.');
            }

            return {
                name: attribute.name, 
                required: attribute.required,
                value: {
                    description: description,
                    type: type
                } 
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

module.exports = {Category, Sequence, CategoryMeta, generateID, generateMeta, isExistedCat, createCategory, createSubcategory, findAll, findOne, findAllFlatten, findAttributes, findProductCatId, updateCategoryData};

