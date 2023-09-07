const Product = require('../models/product.model');
const Helper = require('../helpers/helpers');
const {deleteProduct} = require('../services/deleteAttributes.service');

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

        if (categoryId === null) {
            res.status(404).send({
                message: `Product with category id ${req.params.id} not found.`
            });
            return;
        }

        const sortTerm1 = req.query.sortTerm1 || '';
        const sortDirection1 = req.query.sortDirection1 || '';
        const sortTerm2 = req.query.sortTerm2 || '';
        const sortDirection2 = req.query.sortDirection2 || '';

        const validSortTerms = ['created_at', 'price'];
        const validSortDirections = ['ASC', 'DESC'];

        if ((req.query.sortTerm1 && req.query.sortDirection1) && (req.query.sortTerm2 && req.query.sortDirection2)) {
            if (sortTerm1 === sortTerm2) {
                throw new Error('Sort term 1 and sort term 2 cannot be the same.');
            }

        } else if (req.query.sortTerm1 || req.query.sortDirection1) {
            if (!validSortTerms.includes(sortTerm1)) {
                throw new Error('Invalid sort term 1.');
            }

            if (!validSortDirections.includes(sortDirection1)) {
                throw new Error('Invalid sorting order 1.');
            }
        } else if (req.query.sortTerm2 || req.query.sortDirection2) {
            if (!validSortTerms.includes(sortTerm2)) {
                throw new Error('Invalid sort term 2.');
            }

            if (!validSortDirections.includes(sortDirection2)) {
                throw new Error('Invalid sorting order 2.');
            }
        } else {
        }

        const params = {
            queryParams: req.query,
            categoryId,
            sortTerm1: sortTerm1,
            sortDirection1: sortDirection1,
            sortTerm2: sortTerm2,
            sortDirection2: sortDirection2
        }

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
        const {title, description, price, categoryId, image} = req.body;

        // validate presence of params
        if (productId === null || title === null || description === null || price === null || categoryId === null || image === null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        const params = {
            productId,
            sellerId: req.currentUser.id,
            ...req.body
        }

        const updatedProduct = await Product.update(params);
        res.status(200).json({
            message: `Product with id ${productId} updated successfully.`,
            product: updatedProduct
        });
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
        if (productId === null || imageName === null || image === null) {
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

exports.findBySellerId = async (req, res) => {
    try {
        const sellerId = parseInt(req.currentUser.id);

        if (sellerId === null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        // check if user is seller 
        if (req.currentUser.role !== 'seller') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const params = {
            sellerId,
            queryParams: req.query
        }

        const products = await Product.findBySellerId(params);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving products."
        });
    }
}

exports.findAllByPriceRange = async (req, res) => {
    try {
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;

        if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
            throw new Error('Invalid price range.');
        }

        const sortTerm1 = req.query.sortTerm1 || '';
        const sortDirection1 = req.query.sortDirection1 || '';
        const sortTerm2 = req.query.sortTerm2 || '';
        const sortDirection2 = req.query.sortDirection2 || '';

        const validSortTerms = ['created_at', 'price'];
        const validSortDirections = ['ASC', 'DESC'];

        if ((req.query.sortTerm1 && req.query.sortDirection1) && (req.query.sortTerm2 && req.query.sortDirection2)) {
            if (sortTerm1 === sortTerm2) {
                throw new Error('Sort term 1 and sort term 2 cannot be the same.');
            }

        } else if (req.query.sortTerm1 || req.query.sortDirection1) {
            if (!validSortTerms.includes(sortTerm1)) {
                throw new Error('Invalid sort term 1.');
            }

            if (!validSortDirections.includes(sortDirection1)) {
                throw new Error('Invalid sorting order 1.');
            }
        } else if (req.query.sortTerm2 || req.query.sortDirection2) {
            if (!validSortTerms.includes(sortTerm2)) {
                throw new Error('Invalid sort term 2.');
            }

            if (!validSortDirections.includes(sortDirection2)) {
                throw new Error('Invalid sorting order 2.');
            }
        } else {
        }

        const params = {
            queryParams: req.query,
            minPrice: minPrice,
            maxPrice: maxPrice,
            sortTerm1: sortTerm1,
            sortDirection1: sortDirection1,
            sortTerm2: sortTerm2,
            sortDirection2: sortDirection2
        }

        const products = await Product.findByPriceRange(params);

        res.status(200).json(products);
    } catch (err) {
        res.status(400).send({
            message: err.message || "Invalid request parameters."
        });
    }
}

exports.findAllByKey = async (req, res) => {
    try {
        const key = req.query.key;

        if (!key) {
            throw new Error('Invalid search key.');
        }

        const sortTerm1 = req.query.sortTerm1 || '';
        const sortDirection1 = req.query.sortDirection1 || '';
        const sortTerm2 = req.query.sortTerm2 || '';
        const sortDirection2 = req.query.sortDirection2 || '';

        const validSortTerms = ['created_at', 'price'];
        const validSortDirections = ['ASC', 'DESC'];

        if ((req.query.sortTerm1 && req.query.sortDirection1) && (req.query.sortTerm2 && req.query.sortDirection2)) {
            if (sortTerm1 === sortTerm2) {
                throw new Error('Sort term 1 and sort term 2 cannot be the same.');
            }

        } else if (req.query.sortTerm1 || req.query.sortDirection1) {
            if (!validSortTerms.includes(sortTerm1)) {
                throw new Error('Invalid sort term 1.');
            }

            if (!validSortDirections.includes(sortDirection1)) {
                throw new Error('Invalid sorting order 1.');
            }
        } else if (req.query.sortTerm2 || req.query.sortDirection2) {
            if (!validSortTerms.includes(sortTerm2)) {
                throw new Error('Invalid sort term 2.');
            }

            if (!validSortDirections.includes(sortDirection2)) {
                throw new Error('Invalid sorting order 2.');
            }
        } else {
        }

        const params = {
            queryParams: req.query,
            key: key,
            sortTerm1: sortTerm1,
            sortDirection1: sortDirection1,
            sortTerm2: sortTerm2,
            sortDirection2: sortDirection2
        }

        const products = await Product.findByKey(params);

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Error finding products by key."
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);

        if (productId === null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        // check if user is seller
        if (req.currentUser.role !== 'seller') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const deletedProduct = await deleteProduct(productId, req.currentUser.id);
        
        res.status(200).json({
            message: `Product with id ${productId} deleted successfully.`
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error deleting product."
        });
    }
}
