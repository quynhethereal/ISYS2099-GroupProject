const Product = require('../models/product.model');
const Helper = require('../helpers/helpers');

exports.findAllByCategory = async (req, res) => {
    try {
        const {limit, nextId} = req.body;
        const categoryId = parseInt(req.params.id);

        // validate presence of params
        if (limit === null || nextId === null || categoryId === null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        // validate type of params
        if (typeof limit !== 'number' || typeof categoryId !== 'number' || typeof nextId !== 'number') {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        const params = {limit, categoryId, nextId};

        console.log(params);

        const products = await Product.findByCategory(params);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving products."
        });
    }
}

exports.update = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const {title, description, price, categoryId} = req.body;

        // validate presence of params
        if (productId === null || title === null || description === null || price === null || categoryId === null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        const params = {
            productId,
            ... req.body
        }

        const updatedProduct = await Product.update(params);
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error updating product."
        });
    }
}

exports.updateImage = async (req, res) => {
    try {

        const productId = parseInt(req.params.id);
        const imageName = req.file.originalname || "default.jpg";
        const image = Helper.encodeImage(req.file.path);

        // validate presence of params
        if (productId === null || image === null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        const params = {
            productId,
            image,
            imageName
        }

        const updatedProduct = await Product.updateImage(params);
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error updating product."
        });
    }
}
