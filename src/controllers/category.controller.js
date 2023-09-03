const {createCategory, createSubcategory, findAll, findOne, findAttributes, findProductCatId, updateCategoryData} = require('../models/category.model');

exports.createCategory = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const name = req.body.name;

        if (!name) {
            res.status(400).send({
                message: "Invalid request. Category name is empty."
            });
            return;
        }

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
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating category."
        });
    }   
}

exports.createSubcategory = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const parentId = parseInt(req.params.id);

        if(!parentId) {
            res.status(400).send({
                message: "Invalid request. Empty parent Id."
            })
        } 

        const name = req.body.name;

        if (!name) {
            res.status(400).send({
                message: "Invalid request. Category name is empty."
            });
            return;
        }
        
        const data = {
            parentId: parentId,
            name: name, 
            attributes: req.body.attributes
        }

        const newSubcategory = await createSubcategory(data);

        if(!newSubcategory) {
            res.status(400).send({
                message: "Unable to create new subcategory."
            })
        }

        res.status(200).json(newSubcategory);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating subcategory."
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
        const id = parseInt(req.params.id);

        if (id == null) {
            res.status(400).send({
                message: "Invalid product ID."
            })
        }

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

exports.updateCategory = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const id = parseInt(req.params.id);

        if (!id) {
            res.status(400).send({
                message: "Invalid request. Empty category Id."
            });
            return;
        }
        
        const name = req.body.name;

        if(!name) {
            res.status(400).send({
                message: "Invalid request. Empty name."
            })
        } 

        const data = {
            id: id,
            name: name, 
            attributes: req.body.attributes
        }

        const updateData = await updateCategoryData(data);

        if(!updateData) {
            res.status(400).send({
                message: "Unable to create new subcategory."
            })
        }

        res.status(200).json(updateData);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating subcategory."
        });
    }   
}
