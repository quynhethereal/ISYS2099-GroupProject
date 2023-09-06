const mongoose = require('mongoose');
const {CategoryTree} = require('../helpers/category_tree.structure');
const Product = require('../models/product.model');

const SequenceSchema = new mongoose.Schema({
    _id: String, 
    sequence: {
        type: Number, 
        default: 29
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
    subcategoriesNameArray: {
        type: [String],
        index: true
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

const Category = mongoose.model('Category', CategorySchema);
const Sequence = mongoose.model('Sequence', SequenceSchema);

const generateID = async (model) => {
    try {
        let seq = await Sequence.findOne({ _id: model });
        if (!seq) {
            seq = new Sequence({ _id: model, sequence: 28 });
            await seq.save();
        }
        seq.sequence++;
        await seq.save();
        return seq.sequence;
    } catch (err) {
        console.error('Error generate id for category:', err);
    }

};

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
        console.log('Could not find category');
        throw new Error('Could not find category');
    }
}

const createCategory = async (catObj) => {
    try {
        const name = catObj.name;

        const findName = await Category.findOne({
            $or: [
                {name: name},
                {subcategoriesNameArray: {$elemMatch: {$eq: name}}}
            ]
        });

        if (findName) {
            console.log('Category name is existed');
            throw new Error('Category name is existed');
        }

        // Handle generate ID
        const nextId = await generateID('category'); 

        // attributes include name, required status, description
        const attributes = catObj.attributes.map((attribute) => {
            if (attribute.name == null) {
                console.log('Empty attribute name.');
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
                console.log('Invalid attributes.');
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
            subcategoriesArray:[],
            subcategoriesNameArray:[],
            subcategories: [],
            attributes: attributes
        });

        await data.save();

        return data;
    } catch (err) {
        console.log('Could not create new category');
        throw new Error('Could not create new category');
    }
}

const createSubcategory = async (catObj) => {
    try {
        const name = catObj.name;

        const findName = await Category.findOne({
            $or: [
                {name: name},
                {subcategoriesNameArray: {$elemMatch: {$eq: name}}}
            ]
        });

        if (findName) {
            console.log('Category name is existed');
            throw new Error('Category name is existed');
        }

        const nextId = await generateID('category'); 

        const parentId = catObj.parentId;
        
        // define parent category
        const findCat = await Category.findOne({
            $or: [
                {id: parentId},
                {subcategoriesArray: {$elemMatch: {$eq: parentId}}}
            ]
        });

        if (findCat == null) {
            console.log("Category parent ID is not existed.");
            throw new Error("Category parent ID is not existed.");
        }

        const attributes = catObj.attributes.map((attribute) => {
            if (attribute.name == null) {
                console.log('Empty attribute name.');
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
            attributes: attributes,
            subcategories: []
        }

        findParentAndUpdate(findCat, request);

        findCat.markModified('subcategories'); // Mark as subcategories modified - needed for nested object

        findCat.subcategoriesArray.push(nextId);

        findCat.subcategoriesNameArray.push(catObj.name);

        await findCat.save();

        return ({
            newCategory: request,
            category: findCat
        });
    } catch (err) {
        console.log('Could not create new subcategory');
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
        console.log('Could not create new subcategory by update category');
        throw new Error('Could not create new subcategory by update category');
    }
}

const findAll = async () => {
    try {
        const categories = await Category.find({});
        return categories;  
    } catch (err) {
        console.log('Error finding categories.');
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
        console.log('Error getting category by id.');
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
        console.log('Could not find category.', err.stack);
        throw new Error('Could not find category.');
    }
}

const findNestedSubcategories = async (category) => {
    try {
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
    } catch (err) {
        console.log('Error fetching id and name of subcategories in nested data.');
        throw new Error("Error fetching id and name of subcategories in nested data.");
    }
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
        console.log('Error fetching id and name of categories and subcategories.')
        throw new Error("Error fetching id and name of categories and subcategories.");
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
        console.log('Error getting attributes by id.');
        throw new Error("Error getting attributes by id.");
    }
}

const findProductCatId = async (id) => {
    try {
        const product = await Product.findById(id);

        if (!product) {
            console.log('Product Id not found!');
            throw new Error('Product Id not found.');
        }

        const productCatId = parseInt(product.category_id);

        if (!productCatId) {
            console.log('Product Category Id not found!');
            throw new Error('Product Category Id not found.')
        }

        const data = await findAttributes(productCatId);

        return data;
    } catch (err) {
        console.log('Error getting category id by  product id.');
        throw new Error("Error getting category id by  product id.");
    }
}

const updateCategoryData = async (catObj) => {
    try {
        const id = catObj.id;
        const name = catObj.name;
        const duplicate = await isDuplicateName(name);

        const findCat = await Category.findOne({
            $or: [
                {id: id},
                {subcategoriesArray: {$elemMatch: {$eq: id}}}
            ]
        });

        if (!findCat) {
            throw new Error("Category parent ID is not existed.");
        }

        const count = await Product.countByCategory(id);

        if (count > 0) {
            console.log('Products remain in category!');
            throw new Error('Products remain in category!');
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
            id: id, 
            name: catObj.name,
            attributes: attributes,
            duplicate: duplicate
        }

        const updateName = await findIDAndUpdate(findCat, request, []);

        updateName.sort((a,b) => {
            a.localeCompare(b)
        });

        if (updateName !== null) {
            findCat.subcategoriesNameArray = updateName;
        }

        findCat.markModified('subcategoriesNameArray'); 
        findCat.markModified('subcategories'); // Mark as subcategories modified - needed for nested object
        await findCat.save();

        return ({
            updateCategory: request,
            category: findCat
        });
    } catch (err) {
        console.log('Could not update subcategory');
        throw new Error ('Could not update subcategory');
    }
}

const isDuplicateName = async (name) => {
    const findCat = await Category.findOne({
        $or: [
            {name: name},
            {subcategoriesNameArray: {$elemMatch: {$eq: name}}}
        ]
    });
  
    return !!findCat;
};

const findIDAndUpdate = async (category, request, nameArrays) => {
    try {
        if (category.id === request.id) {
            console.log(request.duplicate);
            if (request.duplicate && category.name == request.name) {
                category.attributes = request.attributes;
                return nameArrays;
            } else if (!request.duplicate) {
                const name = category.name;
                category.name = request.name;
                category.attributes = request.attributes;

                const updateNames = await updateNameArray(request.id, name, request.name);

                nameArrays.push(...updateNames);

                return nameArrays;
            } else {
                console.log('Category name is existed. Could not update name.');
                throw new Error('Category name is existed. Could not update name.');
            }
        }

        for (const subcategory of category.subcategories) {
            await findIDAndUpdate(subcategory, request, nameArrays);
        }

        return nameArrays;
    } catch (err) {
        console.log('Could not update category');
        throw new Error('Could not update category');
    }
}

const updateNameArray = async (id, name, updateName) => {
    try {
        const findCat = await Category.findOne({
            $or: [
                {id: id},
                {subcategoriesArray: {$elemMatch: {$eq: id}}}
            ]
        });
        
        const newNameArray = findCat.subcategoriesNameArray.map(subname => {
            return subname !== name ? subname : updateName;
        });

        return newNameArray;
    } catch (err) {
        console.log('Could not update subcategory name array.');
        throw new Error('Could not update subcategory name array.');
    }
}

const deleteCategory = async (id) => {
    try {
        const findCat = await Category.findOne({id: id});

        if (!findCat) {
            console.log("Category ID is not existed.");
            throw new Error("Category ID is not existed.");
        }

        const catCount = await Product.countByCategory(id);

        if (catCount > 0) {
            console.log('Products remain in category!');
            throw new Error('Products remain in category!');
        }

        for (let i = 0; i < findCat.subcategoriesArray.length; i++) {
            let count = await Product.countByCategory(findCat.subcategoriesArray[i]);

            if (count > 0) {
                console.log('Products remain in subcategories of category!');
                throw new Error('Products remain in subcategories of category!');
            }
        }

        const deleteAction = await Category.deleteOne({id: id});

        if (deleteAction.deletedCount > 0) {
            console.log('Delete successful!');
        } else {
            console.log('Fail to delete!');
        }
    } catch (err) {
        console.log('Could not delete category.');
        throw new Error('Could not delete category.');
    }
}

const deleteSubcategory = async (id) => {
    try {  
        const findCat = await Category.findOne({subcategoriesArray: {$elemMatch: {$eq: id}}});

        if (!findCat) {
            console.log("Category ID is not existed.");
            throw new Error("Category ID is not existed.");
        }

        const catCount = await Product.countByCategory(id);

        if (catCount > 0) {
            console.log('Products remain in subcategory!');
            throw new Error('Products remain in subcategory!');
        }

        const deleteAction = await removeSubcategory(findCat, id);

        findCat.markModified('subcategories'); // Mark as subcategories modified - needed for nested object

        await findCat.save();

        if (deleteAction === null) {
            console.log('Unable to remove subcategory!');
            throw new Error('Unable to remove subcategory!');

        } else {
            const newSubcategoriesArray = []
            for (const subId of findCat.subcategoriesArray) {
                if (!deleteAction.includes(subId)) {
                    newSubcategoriesArray.push(subId);
                }
            }

            findCat.subcategoriesArray = newSubcategoriesArray;
            await findCat.save();
            console.log('Remove subcategory successful!')
        }

    } catch (err) {
        console.log('Could not delete subcategory.');
        throw new Error('Could not delete subcategory.');
    }
}

const removeSubcategory = async (category, id) => {
    try {
        const newSubcategories = [];
        let data = [];

        for (let i = 0; i < category.subcategories.length; i++) {
            if (category.subcategories[i].id !== id) {
                newSubcategories.push(category.subcategories[i]);
            } 
            else {
                const subCats = await countProduct(category.subcategories[i]);
                const count = subCats.count;

                if (count > 0) {
                    console.log('Product remain in subcategory.');
                    newSubcategories.push(category.subcategories[i]);
                } else {
                    data.push(category.subcategories[i].id, ...subCats.subcatIds);
                }
            }
        }
        
        category.subcategories = newSubcategories;

        for (const subcategory of category.subcategories) {
            const subData = await removeSubcategory(subcategory, id);
            data = data.concat(subData);
        }
        return data;

    } catch (err) {
        console.log('Fail to remove subcategory in category');
        throw new Error('Fail to remove subcategory in category');
    }
}

const countProduct = async (category) => {
    try {
        let count = 0;
        const subcatIds = [];

        if (category === null) {
            return 0;
        }

        for (const subcategory of category.subcategories) {
            let value = await Product.countByCategory(subcategory.id);
            count += value;
            let subCount = await countProduct(subcategory);
            count += subCount.count;
            subcatIds.push(subcategory.id, ...subCount.subcatIds);
        }

        return {count, subcatIds};
    } catch (err) {
        console.log('Could not count total product for subcategory');
        throw new Error('Could not count total product for subcategory');
    }
}

module.exports = {Category, Sequence, generateID, isExistedCat, createCategory, createSubcategory, findAll, findOne, findAllFlatten, findAttributes, findProductCatId, updateCategoryData, deleteCategory, deleteSubcategory};

