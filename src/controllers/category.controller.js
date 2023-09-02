const {createCategory, createSubcategory, findAll, findOne, findAttributes, findProductCatId, Category} = require('../models/category.model');
const {generateMany} = require('../db/mongo.seed');

// check if elemt (name) empty in controller, if true, return error
// check if req contain parentId, update cat, add new subcat
// else create new cat
exports.createCategory = async (req, res) => {
    try {
        const name = req.body.name;

        if (!name) {
            res.status(400).send({
                message: "Invalid request. Category name is empty."
            });
            return;
        }
        
        const parentId = req.body.parentId;

        if(!parentId) {
            const data = {
                name: name, 
                attributes: req.body.attributes
            }

            const newCategory = await createCategory(data);

            if (!newCategory) {
                res.status(400).send({
                    message: "Unable to create new category."
                })
            }
            res.status(200).json(newCategory);
        } else {
            const data = {
                parentId: req.body.parentId,
                name: name, 
                attributes: req.body.attributes
            }

            const newSubcategory = await createSubcategory(data);

            // function to update existed cat, create new subcat
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating category."
        });
    }   
}

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
        } else {
            res.status(200).json(category);
        } 
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error get category."
        })
    }
}

exports.findAttributes = async (req, res) => {
    try {
        // TODO: Get attributes of a category
        const id = parseInt(req.params.id);

        if (id == null) {
            res.status(400).send({
                message: "Invalid request."
            })
        }

        // Get the category
        const data = await findAttributes(id);

        if (!data) {
            res.status(404).send ({
                message: `Category with id ${req.params.id} not found.`
            })
        }

        res.status(200).json({
            categoryId: id,
            attributes: data
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error adding attributes to category."
        });
    }
}

exports.findAttributesProduct = async (req, res) => {
    try {
        // TODO: Get attributes of a category
        const id = parseInt(req.params.id);

        if (id == null) {
            res.status(400).send({
                message: "Invalid product ID."
            })
        }

        // Get the category
        const data = await findProductCatId(id);

        if (!data) {
            res.status(404).send ({
                message: `Category with id ${req.params.id} not found.`
            })
        }

        res.status(200).json({
            productId: id,
            attributes: data
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error adding attributes to category."
        });
    }
}