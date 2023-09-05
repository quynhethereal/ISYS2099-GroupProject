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
            name: faker.lorem.word(),
            required: faker.datatype.boolean()
        };

        if (attribute.required) {
            attribute.value = {
                type: faker.helpers.arrayElement(['string', 'number']),
                description: ''
            };

            if (attribute.value.type === 'string') {
                attribute.value.description = faker.commerce.productAdjective();
            } else if (attribute.value.type === 'number') {
                attribute.value.description = faker.number.int(5000);
            }
        }

        resolve(attribute);
    });
}

const generateOne = async () => {
    try {
        const nextId = await generateID('category');

        const category = {
            id: nextId,
            name: faker.commerce.product() + " " + "Parent Category" + " " + Math.floor(Math.random() * 100),
            subcategoriesArray: [],
            subcategoriesNameArray: [],
            subcategories: [],
            attributes: [],
        };
        
        const subCatIds = [];
        const subCatNames = [];

        const attributeCount = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < attributeCount; i++) {
            const attribute = await generateAttribute();
            category.attributes.push(attribute);
        }

        const subcategoryCount = faker.number.int({ min: 0, max: 3 });
        for (let i = 0; i < subcategoryCount; i++) {
            const subcategory = await generateSubcategory(category.id, subCatIds, subCatNames);

            const subCatObj = ({
                id: subcategory.id,
                parentId: subcategory.parentId,
                name: subcategory.name,
                subcategories: subcategory.subcategories,
                attributes: subcategory.attributes,
            })

            category.subcategoriesArray.push(subcategory.id, ...subcategory.subcatIds);   // For fast track cat

            category.subcategoriesNameArray.push(subcategory.name, ...subcategory.subCatNames);   // For fast track cat

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

        const dataNames = category.subcategoriesNameArray;
        const nameResult = new Set();

        for (const data of dataNames) {
            if (!nameResult.has(data)) {
                nameResult.add(data);
            }
        }

        const returnNames = Array.from(nameResult);
        returnNames.sort((a,b) => {
            return a.localeCompare(b);
        });
        
        const newCategory = new Category({
            id: category.id,
            name: category.name,
            subcategoriesArray: returnData,
            subcategoriesNameArray: returnNames,
            subcategories: category.subcategories,
            attributes: category.attributes,
        });

        await newCategory.save();

        return newCategory;
    } catch (error) {
        console.error('Error saving category:', error);
    }
};

const generateSubcategory = async (parentId, subCatIds, subCatNames) => {
    try {
        const nextId = await generateID('category');

        const subcategory = {
            id: nextId,
            parentId: parentId,
            name: faker.commerce.department() + " " + Math.floor(Math.random() * 100),
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
            const subcat = await generateSubcategory(subcategory.id, subCatIds, subCatNames);

            const subcatObj = ({
                id: subcat.id,
                parentId: subcat.parentId,
                name: subcat.name,
                subcategories: subcat.subcategories,
                attributes: subcat.attributes,
            });

            subCatIds.push(...subcat.subcategories.map((subcategory) => subcategory.id));

            subCatNames.push(...subcat.subcategories.map((subcategory) => subcategory.name));

            subcategory.subcategories.push(subcatObj);
        }

        subCatIds.push(...subcategory.subcategories.map((subcategory) => subcategory.id));  // Add to element in subcat and cat

        subCatNames.push(...subcategory.subcategories.map((subcategory) => subcategory.name));  // Add to element in subcat and cat

        return ({
            id: subcategory.id,
            parentId: subcategory.parentId,
            name: subcategory.name,
            subcatIds: subCatIds,
            subCatNames: subCatNames,
            subcategories: subcategory.subcategories,
            attributes: subcategory.attributes
        });
    } catch (error) {
        console.error('Error saving subcategory:', error);
    }
};

module.exports = { generateOne, generateMany };
