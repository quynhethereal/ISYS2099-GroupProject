const {Category} = require('../models/category.model');
const {CategoryTree} = require('../helpers/CategoryTree');
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

const findNestedSubcategories = async (category) => {
    const catObj = {
        id: category.id,
        parentId: category.parentId,
        name: category.name
    };

    const data = [];
    data.push(catObj);

    if (category.subcategories && category.subcategories.length > 0) {
        
        const subcategories = await Promise.all(category.subcategories.map((subcategory) => (findNestedSubcategories(subcategory))));

        for (const subcategory of subcategories) {
            data.push(...subcategory);
        }
    }

    return data;
}

const findAllCatAndSubCat = async () => {
    try {
        const categories = await Category.find({});
        const data = [];

        for (const category of categories) {
            const catObj = await findNestedSubcategories(category);
            data.push(...catObj);
        }

        return data;
    } catch (err) {
        throw new Error("Error fetching id and name of categories and subcategories.", err);
    }
}

// Get both categories and subcategories at same level
exports.findAllSameLevels = async (req, res) => {
    try {
        const data = await findAllCatAndSubCat();

        res.status(200).json(data);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Error getting categories and subcategories as list for user."
        });
    }
}

const findAttributes = async (id) => {
    try {
        const findCat = await Category.findOne({
            $or: [
                {id: id},
                {subcategoriesArray: {$elemMatch: {$eq: id}}}
            ]
        });

        if (findCat == null) {
            throw new Error("Category is not existed.");
        }

        const categoryNode = new CategoryTree();
        categoryNode.buildTree(findCat);
        
        const dataSet = categoryNode.getNodeAttributes(categoryNode.searchNode(id));

        const result = new Set();

        for (const data of dataSet) {
            if (!result.has(data)) {
                result.add(data);
            }
        }

        return Array.from(result);
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
        const data = await findAttributes(id);

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