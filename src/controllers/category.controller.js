const {Category} = require('../models/category.model');

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