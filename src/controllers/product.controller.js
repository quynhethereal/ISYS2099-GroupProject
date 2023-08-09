const Product = require('../models/product.model');

exports.findAll = async (req, res) => {
    try {
        const { limit, offset, category } = req.body;
        const params = { limit, offset, category };

        const products = await Product.findByCategory(params);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving products."
        });
    }
}

