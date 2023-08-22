const Category = require('../models/category.model');
const Product = require('../models/product.model');

// NOTE: Not create auto increment ID yet, update feature later
exports.createCategory = async (req, res) => {
    try {
        const name = req.body.name;
        const sameNameCategory = await Category.findOne({name: name});
        const sameIdCategory = await Category.findOne({name: name});
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