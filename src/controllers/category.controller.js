const {Category} = require('../models/category.model');
const {CategoryTree} = require('../helpers/CategoryTree');
const Product = require('../models/product.model');

/*
body params 
{
    name: New Category
    attributes: [
        descriptions: ["abc","xyz", 123]
    ], 
    subcategories: [
        name: New Category
        attributes: [
            descriptions: ["a1b","txd", 234]
        ], 
    ]
}
*/
exports.createCategory = async (req, res) => {
    try {
        const name = req.body.name;
        const duplicateCategory = await Category.findOne({name: name});
        if (duplicateCategory) {
            res.status(400).send({
                message: "Invalid request. Category is existed."
            });
            return;
        } 

        // Handle generate ID

        const category = Category.create(req.body);
        res.status(200).json(category);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating category."
        });
    }   
}

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
    console.log(data);

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

const findOne = async (id) => {
    try {
        const model = [
            {
                $facet: {
                    category: [
                        {$match: {id: id}}, 
                        {$limit: 1}
                    ], 
                    subcategory: [
                        {$unwind: "$subcategories"},
                        {$match: {"subcategories.id": id}},
                        {$limit: 1}
                    ]
                }
            }, 
            {
                $project: {
                    result: {
                        $cond: {
                            if: { $ne: [{ $size: "$category" }, 0] },
                            then: { $arrayElemAt: ["$category", 0] },
                            else: {
                                $cond: {
                                if: { $ne: [{ $size: "$subcategory" }, 0] },
                                then: { $arrayElemAt: ["$subcategory", 0] },
                                else: null
                                }
                            }
                        }
                    }
                }
            }
        ];

        const result = await Category.aggregate(model);

        if (result.length > 0) {
            return result[0].result;
        } 
    } catch (err) {
        throw new Error("Error getting category by id.");
    }
}

exports.findOne = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);

        if (categoryId == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }
        
        const category  = await findOne(categoryId);

        if (!category) {
            res.status(404).send({
                message: `Category with id ${req.params.id} not found.`
            });
        } else {
            res.status(200).json(category);
        } 
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error get category."
        })
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
        console.log('sub', Category.findOne)
        console.log(findCat)

        if (findCat == null) {
            throw new Error("Category is not existed.");
        }

        const categoryNode = new CategoryTree();
        categoryNode.buildTree(findCat);
        
        const dataSet = categoryNode.getNodeAttributes(categoryNode.searchNode(id));

        console.log(dataSet);
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

exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const name = req.body.name;
        const attributes = req.body.attributes;
        var parent = req.body.parent; // optional attribute

        if (name == null || attributes == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        // Check value name is existed
        const originalCategory = await Category.findOne({id: id});
        const findCategory = await Category.findOne({name: name});

        // Check if the name of the category is duplicated with others.
        if (name != originalCategory.name && findCategory) {
            res.status(400).send({
                message: "Invalid request. Category is existed."
            });
            return;
        }

        // Check if the category contains parent category
        if (parent == null) {
            // Put update value in params
            const params = {
                name: name,
                attributes: attributes
            }

            // find and update category
            var updateCategory = await Category.findOneAndUpdate({id: id}, params, {new: true});
            res.status(200).json(updateCategory);
        } else {
            const parentId = parseInt(parent);

            // Check if the parent ID is not the same as ID of category
            if (!parentId || parentId == id) {
                res.status(400).send({
                    message: "Invalid parent ID."
                });
                return;
            }

            const params = {
                name: name,
                attributes: attributes,
                parent: parentId
            }
    
            var updateCategory = await Category.findOneAndUpdate({id: id}, params, {new: true});
            res.status(200).json(updateCategory);
        }
        
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error updating category."
        });
    }
}

// Only availble when list cat's products is empty
// NOT WORK
exports.delete = async (req, res) => {
    try {
        //TODO: Delete category
        const count = await Product.countByCategory(req.params.id);

        // TODO: Handle API after delete
        if (count > 0) {
            res.status(400).send({
                message: "Invalid request. This category has some remained products. Could not delete."
            })
        }
        Category.deleteOne({id: req.params.id});

    } catch (err) {
        res.status(500).send({
            message: err.message || "Error deleting category."
        });
    }
}