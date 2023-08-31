const {Category, Sequence} = require('../models/category.model');
const {faker} = require('@faker-js/faker');
const Product = require('../models/product.model');

// Generate ID for Category
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

// Generate data for Category
const generateMany = async (count) => {
    try {
        const categories = [];

        for (let i = 0; i < count; i++) {
            const category = await generateOne();
            categories.push(category);
        }
        console.log(categories);

        return categories;
    } catch (err) {
        console.error('Error saving many category:', err);
    }
    
}

const generateOne = async () => {
    try {
        const nextId = await generateID('category');

        const category = {
            id: nextId,
            name: faker.commerce.department(),
            subcategories: [],
            attributes: [],
        };

        const attributeCount = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < attributeCount; i++) {
            const attribute = await generateAttribute();
            category.attributes.push(attribute);
        }

        const subcategoryCount = faker.number.int({ min: 0, max: 3 });
        for (let i = 0; i < subcategoryCount; i++) {
            const subcategory = await generateSubcategory(category.id);

            // console.log('subcategory', subcategory);

            category.subcategories.push(subcategory);
            // console.log(category.subcategories);
        }

        const cat = new Category({
            id: category.id,
            name: category.name,
            subcategories: category.subcategories,
            attributes: category.attributes,
        });

        // console.log('cat', cat);

        return cat;
    } catch (error) {
        console.error('Error saving category:', error);
    }
};

const generateSubcategory = async (parentId) => {
    try {
        const nextId = await generateID('category');
    
        const subcategory = {
            id: nextId,
            parentId: parentId,
            name: faker.commerce.department(),
            subcategories: [],
            attributes: [],
        };
    
        const attributeCount = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < attributeCount; i++) {
            const attribute = await generateAttribute();
            subcategory.attributes.push(attribute);
        }

        const subcategoryCount = faker.number.int({ min: 0, max: 1 });
        for (let i = 0; i < subcategoryCount; i++) {
            const subcat = await generateSubcategory(subcategory.id);

            const subcatObj = ({
                id: subcat.id,
                parentId: subcat.parentId,
                name: subcat.name,
                subcategories: subcat.subcategories,
                attributes: subcat.attributes,
            });

            // console.log(subcatObj);
            subcategory.subcategories.push(subcatObj);
        }
    
        const subcat = ({
            id: subcategory.id,
            parentId: subcategory.parentId,
            name: subcategory.name,
            subcategories: subcategory.subcategories,
            attributes: subcategory.attributes
        });
    
        return subcat;
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
};

const generateAttribute = () => {
    return new Promise((resolve, reject) => {
        const attribute = {
            description: '',
            type: faker.helpers.arrayElement(['string', 'number']),
        };
    
        if (attribute.type == 'string') {
            attribute.description = faker.lorem.words();
        } else {
            attribute.description = faker.number.int();
        }
    
        resolve(attribute);
    });
}

// Auto-generate 10 category
const checkToInsert = async (req, res) => {
    try {
        const count = await Category.countDocuments();

        if (count == 0) {
            Category.insertMany(await generateMany(5))
                .then((result) => {
                    console.log(`Categories saved to MongoDB`);
                })
                .catch((error) => {
                    // console.log(`Categories could not save to MongoDB`, error);
                });
        }

    } catch (err) {
        res.status(500).send({
            message: err.message || "Error to auto-generate dummy data."
        });
    }
}
// Category.collection.getIndexes().then(console.log);

// Generate dummy data
checkToInsert();

/*
body params 
{
    name: New Category
    attributes: [
        descriptions: ["abc","xyz", 123]
    ], 
    subcategories: [
        name: New Category
        attributes: [
            descriptions: ["a1b","txd", 234]
        ], 
    ]
}
*/
exports.createCategory = async (req, res) => {
    try {
        const name = req.body.name;
        const duplicateCategory = await Category.findOne({name: name});
        if (duplicateCategory) {
            res.status(400).send({
                message: "Invalid request. Category is existed."
            });
            return;
        } 

        // Handle generate ID

        const category = Category.create(req.body);
        res.status(200).json(category);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating category."
        });
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

exports.findAll = async (req, res) => {
    try {
        const categories = await findAll();

        if (categories.length > 0) {
            res.status(200).json(categories);
        } else if (categories.length == 0) {
            res.status(200).send({
                message: "No category."
            })
        } else {
            res.status(400).send({
                message: "Invalid request."
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error finding products by key."
        });
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

    return data;
}

const findAllCatAndSubCat = async () => {
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

// Get both categories and subcategories at same level
exports.findAllSameLevels = async (req, res) => {
    try {
        const data = await findAllCatAndSubCat();

        res.status(200).json(data);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Error getting categories and subcategories as list for user."
        });
    }
}

const findOne = async (id) => {
    try {
        const model = [
            {
                $facet: {
                    category: [
                        {$match: {id: id}}, 
                        {$limit: 1}
                    ], 
                    subcategory: [
                        {$unwind: "$subcategories"},
                        {$match: {"subcategories.id": id}},
                        {$limit: 1}
                    ]
                }
            }, 
            {
                $project: {
                    result: {
                        $cond: {
                            if: { $ne: [{ $size: "$category" }, 0] },
                            then: { $arrayElemAt: ["$category", 0] },
                            else: {
                                $cond: {
                                if: { $ne: [{ $size: "$subcategory" }, 0] },
                                then: { $arrayElemAt: ["$subcategory", 0] },
                                else: null
                                }
                            }
                        }
                    }
                }
            }
        ];

        const result = await Category.aggregate(model);

        if (result.length > 0) {
            return result[0].result;
        } 
    } catch (err) {
        throw new Error("Error getting category by id.");
    }
}

exports.findOne = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);

        if (categoryId == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }
        
        const category  = await findOne(categoryId);

        if (!category) {
            res.status(404).send({
                message: `Category with id ${req.params.id} not found.`
            });
            return;
        } else {
            res.status(200).json(category);
        } 
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error get category."
        })
    }
}

const getAttributes = async (id) => {
    try {
        
    } catch (err) {
        throw new Error("Error getting attributes by id.");
    }
}

exports.getAttributes = async (req, res) => {
    try {
        // TODO: Get attributes of a category
        const id = parseInt(req.params.id);

        if (id == null) {
            res.status(400).send({
                message: "Invalid request."
            })
        }

        // Get the category
        const category = await Category.findOne({id: id});

        if (!category) {
            res.status(404).send ({
                message: `Category with id ${req.params.id} not found.`
            })
        }

        // Check if the category is a subcategory or main one
        if (category.parent == null) {
            res.status(200).json(category.attributes);
            return;
        }

        const parentId = parseInt(category.parent);
        const parentCategory = await Category.findOne({id: parentId});

        if (!parentCategory) {
            res.status(404).send({
                message: `Parent category with id ${parentId} not found.`
            })
        }

        const parentAttributes = await parentCategory.attributes;

        if (parentAttributes == null) {
            // This could responds empty
            res.status(200).json(category.attributes);
            return;
        }

        // Concat attributes of category and subcategory
        const allAttributes = category.attributes.concat(parentAttributes);
        const params = {
            attributes: allAttributes
        }

        res.status(200).json(params);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error adding attributes to category."
        });
    }
}

exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const name = req.body.name;
        const attributes = req.body.attributes;
        var parent = req.body.parent; // optional attribute

        if (name == null || attributes == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        // Check value name is existed
        const originalCategory = await Category.findOne({id: id});
        const findCategory = await Category.findOne({name: name});

        // Check if the name of the category is duplicated with others.
        if (name != originalCategory.name && findCategory) {
            res.status(400).send({
                message: "Invalid request. Category is existed."
            });
            return;
        }

        // Check if the category contains parent category
        if (parent == null) {
            // Put update value in params
            const params = {
                name: name,
                attributes: attributes
            }

            // find and update category
            var updateCategory = await Category.findOneAndUpdate({id: id}, params, {new: true});
            res.status(200).json(updateCategory);
        } else {
            const parentId = parseInt(parent);

            // Check if the parent ID is not the same as ID of category
            if (!parentId || parentId == id) {
                res.status(400).send({
                    message: "Invalid parent ID."
                });
                return;
            }

            const params = {
                name: name,
                attributes: attributes,
                parent: parentId
            }
    
            var updateCategory = await Category.findOneAndUpdate({id: id}, params, {new: true});
            res.status(200).json(updateCategory);
        }
        
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error updating category."
        });
    }
}

// Only availble when list cat's products is empty
// NOT WORK
exports.delete = async (req, res) => {
    try {
        //TODO: Delete category
        const count = await Product.countByCategory(req.params.id);

        // TODO: Handle API after delete
        if (count > 0) {
            res.status(400).send({
                message: "Invalid request. This category has some remained products. Could not delete."
            })
        }
        Category.deleteOne({id: req.params.id});

    } catch (err) {
        res.status(500).send({
            message: err.message || "Error deleting category."
        });
    }
}