const Category = require('../models/category.model');
const Product = require('../models/product.model');

// Category.collection.drop();

// Add dummy data
Category.find({})
.then((documents) => {
    if (documents.length == 0) {
        Category.insertMany([
            {id: 1, name: 'Clothing and Accessories'},
            {id: 2, name: 'Electronics and Gadgets'},
            {id: 3, name: 'Home and Kitchen Appliances'},
            {id: 4, name: 'Beauty and Personal Care'},
            {id: 5, name: 'Books, Music, and Movies'},
            {id: 6, name: 'Sports and Fitness Equipment'},
            {id: 7, name: 'Toys and Games'},
            {id: 8, name: 'Furniture and Home Decor'},
            {id: 9, name: 'Groceries and Food Items'},
            {id: 10, name: 'Health and Wellness Products'},
            {id: 11, name: 'Automotive and Car Accessories'},
            {id: 12, name: 'Office Supplies and Stationery'},
            {id: 13, name: 'Pet Supplies'},
            {id: 14, name: 'Outdoor and Camping Gear'},
            {id: 15, name: 'Jewelry and Watches'},
            {id: 16, name: 'Baby and Kids Products'},
            {id: 17, name: 'Crafts and DIY Supplies'},
            {id: 18, name: 'Party and Event Supplies'},
            {id: 19, name: 'Travel and Luggage'},
            {id: 20, name: 'Gifts and Novelty Items'}
        ]);
    }
})
.catch((error) => {
    console.error('Error fetching documents:', error);
});

// NOTE: Not create auto increment ID yet, update feature later
exports.createCategory = async (req, res) => {
    try {
        const name = req.body.name;
        const sameNameCategory = await Category.findOne({name: name});
        const sameIdCategory = await Category.findOne({name: name});
        if (sameNameCategory || sameIdCategory) {
            res.status(400).send({
                message: "Invalid request. Category is existed."
            });
            return;
        } 

        if(sameIdCategory) {

        }
        const category = Category.create(req.body);
        res.status(200).json(category);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating category."
        });
    }   
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        if ((await categories).length > 0) {
            res.status(200).json(categories);
        } else if ((await categories).length == 0) {
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

exports.getOne = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);

        if (categoryId == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }
        
        const category  = await Category.find({id: categoryId});

        if (!category) {
            res.status(404).send({
                message: `Category with id ${req.params.id} not found.`
            });
            return;
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error get category."
        })
    }
}

exports.getCategoryId = async (req, res) => {
    try {
        const categoryName = req.body.name;

        if (categoryName == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        const category  = await Category.find({name: categoryName});

        if (!category) {
            res.status(404).send({
                message: `Category with id ${req.body.name} not found.`
            });
            return;
        }
        res.status(200).json(category);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Error get category ID."
        })
    }
}

exports.addSubCategory = async (req, res) => {
    try {
        // TODO: Add subcategory to parent
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error adding subcategory."
        });
    }
}

exports.getSubCategories = async (req, res) => {
    try {
        const category = parseInt(req.params.id);

        if (category == null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        const subcategories = await Category.find({parent: category});

        if (!subcategories) {
            res.status(404).send({
                message: `Category with id ${req.params.id} has no subcategory.`
            });
            return;
        }
        res.status(200).json(subcategories);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Error get subcategories of ..."
        });
    }
}

exports.getAttributes = async (req, res) => {
    try {
        // TODO: Add attributes to categories
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error adding attributes to category."
        });
    }
}

exports.update = async (req, res) => {
    try {
        //TODO: Update features of categories
        const id = parseInt(req.params.id);
        const name = req.body.name;
        const attributes = req.body.attributes;
        var parent = req.body.parent;

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