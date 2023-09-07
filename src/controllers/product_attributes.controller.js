const {
    createAttributes, 
    findAll,
    findProductAttributes, 
    updateCurrentAttributes,
} = require ('../models/product_attributes.model');

const {recreateAttributes} = require('../services/recreateAttributes.service');

exports.createProductAttributes = async (req, res) => {
    try {
        if (req.currentUser.role !== 'seller') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const id = parseInt(req.params.id);

        if (!id) {
            res.status(400).send({
                message: "Invalid request. Product id is empty."
            });
            return;
        }

        const createdAttributes = await createAttributes(id, req.body.categoryId, req.body.attributes);

        if (!createdAttributes) {
            res.status(400).send({
                message: "Unable to create new category."
            })
        }
        res.status(200).json(createdAttributes);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating category."
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        const attributes = await findAll();

        if (attributes.length > 0) {
            res.status(200).json(attributes);
        } else if (attributes.length == 0) {
            res.status(200).send({
                message: "No product attributes."
            })
        } else {
            res.status(400).send({
                message: "Invalid request."
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error finding product attributes list."
        });
    }
}

exports.findByProductId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id) {
            res.status(400).send({
                message: "Invalid request. Product id is empty."
            });
            return;
        }

        const attribute = await findProductAttributes(id);

        if (attribute.length > 0) {
            res.status(200).json(attribute);
        } else if (attribute.length == 0) {
            res.status(200).send({
                message: "No recorded attributes."
            })
        } else {
            res.status(400).send({
                message: "Invalid request."
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error finding attributes for given id."
        });
    }
}

exports.updateAttributes = async (req, res) => {
    try {
        if (req.currentUser.role !== 'seller') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const id = parseInt(req.params.id);

        if (!id) {
            res.status(400).send({
                message: "Invalid request. Product id is empty."
            });
            return;
        }

        const attribute = await updateCurrentAttributes(id, req.body.attributes);

        if (!attribute) {
            res.status(400).send({
                message: "Unable to create new category."
            })
        }
        res.status(200).json(attribute);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error updating attributes."
        });
    }
}

exports.recreateAttributes = async (req, res) => {
    try {
        if (req.currentUser.role !== 'seller') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const id = parseInt(req.params.id);

        if (!id) {
            res.status(400).send({
                message: "Invalid request. Product id is empty."
            });
            return;
        }

        const createdAttributes = await recreateAttributes(id, req.body.categoryId, req.body.attributes);

        if (!createdAttributes) {
            res.status(400).send({
                message: "Unable to create new category."
            })
        }
        res.status(200).json(createdAttributes);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating category."
        });
    }
}