const {Category, Sequence} = require('../models/category.model');
const {faker} = require('@faker-js/faker');


const generateID = async (model) => {
    try {
        const doc = await Sequence.findOneAndUpdate (
            {_id: model},      // Define the model that need to adjust ID value
            {$inc: {sequence : 1}}, // Increase ID by 1
            {new: true, upsert: true}
        )
        return doc.sequence;
    } catch (err) {
        console.error('Error generate id for category:', err);
    }

};

const generateMany = async (count) => {
    try {
        const categories = [];

        for (let i = 0; i < count; i++) {
            const category = await generateOne();
            categories.push(category);
        }
        // console.log(categories);

        return categories;
    } catch (err) {
        console.error('Error saving many category:', err);
    }
}

const generateAttribute = () => {
    return new Promise((resolve, reject) => {
        const attribute = {
            description: '',
            type: faker.helpers.arrayElement(['string', 'number']),
        };

        if (attribute.type === 'string') {
            attribute.description = faker.commerce.productAdjective();
        } else {
            attribute.description = faker.number.int();
        }

        resolve(attribute);
    });
}


const generateOne = async () => {
    try {
        const nextId = await generateID('category');

        const category = {
            id: nextId,
            name: faker.commerce.product() + " " + "Parent Category",
            subcategoriesArray: [],
            subcategories: [],
            attributes: [],
        };

        const attributeCount = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < attributeCount; i++) {
            const attribute = await generateAttribute();
            category.attributes.push(attribute);
        }

        const subcategoryCount = faker.number.int({ min: 0, max: 3 });
        for (let i = 0; i < subcategoryCount; i++) {
            const subcategory = await generateSubcategory(category.id);

            category.subcategoriesArray.push(subcategory.id,...subcategory.subcategoriesArray);   // For fast track cat

            category.subcategories.push(subcategory);
        }

        return new Category({
            id: category.id,
            name: category.name,
            subcategoriesArray: category.subcategoriesArray,
            subcategories: category.subcategories,
            attributes: category.attributes,
        });
    } catch (error) {
        console.error('Error saving category:', error);
    }
};

const generateSubcategory = async (parentId) => {
    try {
        const nextId = await generateID('category');

        const subcategory = {
            id: nextId,
            parentId: parentId,
            name: faker.commerce.department() + " " + Math.floor(Math.random() * 100),
            subcategoriesArray: [],
            subcategories: [],
            attributes: [],
        };

        const attributeCount = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < attributeCount; i++) {
            const attribute = await generateAttribute();
            subcategory.attributes.push(attribute);
        }

        const subcategoryCount = faker.number.int({ min: 0, max: 1 });
        for (let i = 0; i < subcategoryCount; i++) {
            const subcat = await generateSubcategory(subcategory.id);

            const subcatObj = ({
                id: subcat.id,
                parentId: subcat.parentId,
                name: subcat.name,
                subcategoriesArray: subcat.subcategoriesArray,
                subcategories: subcat.subcategories,
                attributes: subcat.attributes,
            });

            subcategory.subcategoriesArray.push(subcatObj.id,...subcatObj.subcategoriesArray);  // Add to element in subcat and cat
            subcategory.subcategories.push(subcatObj);
        }

        return ({
            id: subcategory.id,
            parentId: subcategory.parentId,
            name: subcategory.name,
            subcategoriesArray: subcategory.subcategoriesArray,
            subcategories: subcategory.subcategories,
            attributes: subcategory.attributes
        });
    } catch (error) {
        console.error('Error saving subcategory:', error);
    }
};

module.exports = { generateOne, generateMany };