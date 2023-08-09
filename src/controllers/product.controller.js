const Product = require('../models/product.model');

exports.findAll = async (req, res) => {
    try {
        const { limit, nextId, categoryId } = req.body;
        const params = { limit, categoryId, nextId };

        console.log(params);

        const products = await Product.findByCategory(params);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving products."
        });
    }
}

