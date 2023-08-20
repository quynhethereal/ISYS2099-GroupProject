const Category = require('../models/category.model');

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

// No subcategory
exports.createCategory = async (req, res) => {
    const name = req.body.name;
    const findCategory = await Category.findOne({name: name});
    if (!findCategory) {
        const category = Category.create(req.body);
        res.status(200).json(category);
    } else {
        res.send({
            message: "Category is existed."
        });
    }
}

exports.getAllCategories = async (req, res) => {
    const categories = await Category.find({});
    try {
        if ((await categories).length > 0) {
            res.status(200).json(categories);
        } else if ((await categories).length == 0) {
            res.send({
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

exports.addSubCategory = async (req, res) => {
    try {
        // TODO: Add subcategory to parent
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error adding subcategory."
        });
    }
}

exports.addAttribute = async (req, res) => {
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
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error updating category."
        });
    }
}

// Only availble when list cat's products is empty
exports.delete = async (req, res) => {
    try {
        //TODO: Delete category
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error deleting category."
        });
    }
}