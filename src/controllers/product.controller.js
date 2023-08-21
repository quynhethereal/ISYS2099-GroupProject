const Product = require('../models/product.model');
const Helper = require('../helpers/helpers');

exports.findAll = async (req, res) => {
    try {
        const products = await Product.findAll(req.query);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving products."
        });
    }
}

exports.findById = async (req, res) => {
    try {
        const product = await Product.findById(parseInt(req.params.id));
        if (!product) {
            res.status(404).send({
                message: `Product with id ${req.params.id} not found.`
            });
            return;
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving product."
        });
    }
}

exports.findAllByCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);

        const params = {
            categoryId,
            queryParams: req.query
        }

        const products = await Product.findByCategory(params);

        res.status(200).json(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving products."
        });
    }
}

exports.findByKey = async (req, res) => {
    try {
        const key = req.params.key;

        if (key == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        const products = await Product.findByKey(key);

        res.status(200).json(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error finding products by key."
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

exports.getImage = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);

        // validate presence of params
        if (productId === null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        const image = await Product.getImage(productId);
        res.status(200).json(image);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving product image."
        });
    }
}
