const {createAttributes} = require ('../models/product_attributes.model');

exports.createCategory = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'seller') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const id = req.params.id;

        if (!id) {
            res.status(400).send({
                message: "Invalid request. Product id is empty."
            });
            return;
        }

        const data = {
            productId: id,
            categoryId: req.body.categoryId,
            attributes: req.body.attributes
        }

        const createdAttributes = await createAttributes(data);

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