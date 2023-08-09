const Product = require('../models/product.model');

exports.findAllByCategory = async (req, res) => {
    try {
        const { limit, nextId } = req.body;
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

