const {Category, Subcategory, Sequence} = require('../models/category.model');
const {faker} = require('@faker-js/faker');
const mongoose = require('mongoose');
const Product = require('../models/product.model');

// Generate ID for Category
const generateID = async (model) => {
    const doc = await Sequence.findOneAndUpdate(
        {_id: model},      // Define the model that need to adjust ID value 
        {$inc: {sequence : 1}}, // Increase ID by 1
        {new: true, upsert: true}
    )
    return doc.sequence;
};

// Generate data for Category
const generateMany = (count) => {
    const categories = [];

    for (let i = 0; i < count; i++) {

        const category = generateOne();
        categories.push(category);
    }

    console.log(categories);

    return categories;
}

const generateOne = () => {
    generateID('category')
        .then((nextId) => {  
            // console.log(nextId);      
            const category = {
                id: nextId,
                name: faker.commerce.department(),
                subcategories: [],
                attributes: [],
            }
        
            const attributeCount = faker.number.int({min: 1, max: 3});
            for (let i = 0; i < attributeCount; i++) {
                const attribute = generateAttribute();
                category.attributes.push(attribute);
            }

            const subcategoryCount = faker.number.int({min: 0, max: 3});
            for (let i = 0; i < subcategoryCount; i++) {
                const subcategory = generateSubcategory();
                // console.log(generateSubcategory())
                console.log('Subcat', subcategory);

                category.subcategories.push(new Subcategory({
                    id: subcategory.id, 
                    name: subcategory.name, 
                    attributes: subcategory.attributes
                }));
            }

            const cat = new Category({
                id: category.id,
                name: category.name,
                subcategories: category.subcategories,
                attributes: category.attributes
            });                                       
            
            console.log(cat);
            return cat.save();
        })
        .then(() => {
            // console.log('Category saved');
        })
        .catch((error) => {
            console.error('Error saving subcategory:', error);
        });
}

const generateSubcategory = () => {
    generateID('subcategory')
      .then((nextId) => {
        // console.log('nextId:' , nextId)
        const subcategory = {
            id: nextId,
            name: faker.commerce.department(),
            attributes: [],
        }

        // console.log('subcat in generate: ', subcategory)
        
        const attributeCount = faker.number.int({min: 0, max: 3});
        for (let i = 0; i < attributeCount; i++) {
            const attribute = generateAttribute();
            subcategory.attributes.push(attribute);
        }

        const subcat = new Subcategory({
            id: subcategory.id,
            name: subcategory.name,
            attributes: subcategory.attributes
        });
    
        console.log(subcat);
    
        return subcat.save();

      })
      .then(() => {
        // console.log('Subcategory saved');
      })
      .catch((error) => {
        console.error('Error saving subcategory:', error);
      });
}

const generateAttribute = () => {
    const attribute = {
        description: faker.lorem.word(),
        type: faker.helpers.arrayElement(['string', 'number'])
    };

    if (attribute.type == 'string') {
        attribute.description = faker.lorem.words();
    } else {
        attribute.description = faker.number.int();
    }
    
    return attribute;
}

// Auto-generate 10 category
Category.insertMany(generateMany(1))
    .then((result) => {
    console.log(`${result.length} categories saved to MongoDB`);
    })
    .catch((error) => {
    console.error('Error saving categories to MongoDB:', error);
    });

// NOTE: Not create auto increment ID yet, update feature later
exports.createCategory = async (req, res) => {
    try {
        const name = req.body.name;
        const sameNameCategory = await Category.findOne({name: name});
        if (sameNameCategory || sameIdCategory) {
            res.status(400).send({
                message: "Invalid request. Category is existed."
            });
            return;
        } 
        
        const category = Category.create(req.body);
        res.status(200).json(category);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating category."
        });
    }   
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        if ((await categories).length > 0) {
            res.status(200).json(categories);
        } else if ((await categories).length == 0) {
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

exports.getOne = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);

        if (categoryId == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }
        
        const category  = await Category.find({id: categoryId});

        if (!category) {
            res.status(404).send({
                message: `Category with id ${req.params.id} not found.`
            });
            return;
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error get category."
        })
    }
}

exports.getSubCategories = async (req, res) => {
    try {
        const category = parseInt(req.params.id);

        if (category == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        const subcategories = await Category.find({parent: category});

        if (!subcategories) {
            res.status(404).send({
                message: `Category with id ${req.params.id} has no subcategory.`
            });
            return;
        }
        res.status(200).json(subcategories);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Error get subcategories."
        });
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