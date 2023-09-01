const {Category} = require('../models/category.model');
const {CategoryTree} = require('../helpers/category_tree.structure');
const Product = require('../models/product.model');

const findAll = async () => {
    try {
        const categories = await Category.find({});
        return categories;  
    } catch (error) {
        throw new Error("Error finding categories.");
    }
};

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

const findCatAttributes = async (id) => {
    try {
        const cat = await Category.findOne({
            $or: [
                {id: id},
                {subcategoriesArray: {$elemMatch: {$eq: id}}}
            ]
        });

        if (cat === null) {
            throw new Error("Category is not existed.");
        }

        const categoryNode = new CategoryTree();
        categoryNode.buildTree(cat);

        return Array.from(categoryNode.getNodeAttributes(categoryNode.searchNode(id)));
    } catch (err) {
        throw new Error("Error getting attributes by id.");
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
        const data = await findCatAttributes(id);

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

const findProductCatId = async (id) => {
    try {
        const product = await Product.findById(id);

        if (!product) {
            throw new Error('Product Id not found.')
        }

        const productCatId = parseInt(product.category_id);

        if (!productCatId) {
            throw new Error('Product Category Id not found.')
        }

        const data = await findAttributes(productCatId);

        return data;
    } catch (err) {
        throw new Error("Error getting category id by  product id.");
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