const {Category, generateID, generateMeta} = require('../models/category.model');
const {faker} = require('@faker-js/faker');

const generateMany = async (count) => {
    try {
        const categories = [];

        for (let i = 0; i < count; i++) {
            const category = await generateOne();
            categories.push(category);
        }

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
            attribute.description = faker.number.int(5000);
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
        
        const subCatIds = [];

        const attributeCount = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < attributeCount; i++) {
            const attribute = await generateAttribute();
            category.attributes.push(attribute);
        }

        const subcategoryCount = faker.number.int({ min: 0, max: 3 });
        for (let i = 0; i < subcategoryCount; i++) {
            const subcategory = await generateSubcategory(category.id, subCatIds);

            const subCatObj = ({
                id: subcategory.id,
                parentId: subcategory.parentId,
                name: subcategory.name,
                subcategories: subcategory.subcategories,
                attributes: subcategory.attributes,
            })

            category.subcategoriesArray.push(subcategory.id, ...subcategory.subcatIds);   // For fast track cat

            category.subcategories.push(subCatObj);
        }

        const dataSet = category.subcategoriesArray;
        const result = new Set();

        for (const data of dataSet) {
            if (!result.has(data)) {
                result.add(data);
            }
        }

        const returnData = Array.from(result);
        returnData.sort((a,b) => a - b);
        
        const newCategory = new Category({
            id: category.id,
            name: category.name,
            subcategoriesArray: returnData,
            subcategories: category.subcategories,
            attributes: category.attributes,
        });

        await newCategory.save();

        if (newCategory) {
            await generateMeta(nextId, category.name);
            return newCategory;
        } 
    } catch (error) {
        console.error('Error saving category:', error);
    }
};

const generateSubcategory = async (parentId, subCatIds) => {
    try {
        const nextId = await generateID('category');

        const subcategory = {
            id: nextId,
            parentId: parentId,
            name: faker.commerce.department() + " " + Math.floor(Math.random() * 100),
            subcategories: [],
            attributes: [],
        };

        await generateMeta(nextId, subcategory.name);

        const attributeCount = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < attributeCount; i++) {
            const attribute = await generateAttribute();
            subcategory.attributes.push(attribute);
        }

        const subcategoryCount = faker.number.int({ min: 0, max: 1 });
        for (let i = 0; i < subcategoryCount; i++) {
            const subcat = await generateSubcategory(subcategory.id, subCatIds);

            const subcatObj = ({
                id: subcat.id,
                parentId: subcat.parentId,
                name: subcat.name,
                subcategories: subcat.subcategories,
                attributes: subcat.attributes,
            });

            subCatIds.push(...subcat.subcategories.map((subcategory) => subcategory.id));

            subcategory.subcategories.push(subcatObj);
        }

        subCatIds.push(...subcategory.subcategories.map((subcategory) => subcategory.id));  // Add to element in subcat and cat

        return ({
            id: subcategory.id,
            parentId: subcategory.parentId,
            name: subcategory.name,
            subcatIds: subCatIds,
            subcategories: subcategory.subcategories,
            attributes: subcategory.attributes
        });
    } catch (error) {
        console.error('Error saving subcategory:', error);
    }
};

module.exports = { generateID, generateOne, generateMany };