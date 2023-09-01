const {findAll, findOne, findAttributes, findProductCatId} = require('../models/category.model');

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

        res.status(200).json(data);
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
                message: "Invalid request."
            })
        }

        // Get the category
        const data = await findProductCatId(id);

        if (!data) {
            res.status(404).send ({
                message: `Category with id ${req.params.id} not found.`
            })
        }

        res.status(200).json(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error adding attributes to category."
        });
    }
}