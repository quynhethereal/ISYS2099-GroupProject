const Product = require('../models/product.model');
const {ProductAttributes} = require('../models/product_attributes.model');
const {findAttributes} = require('../models/category.model');
const {deleteAttributes} = require('./deleteAttributes.service');

const recreateAttributes = async (productId, categoryId, attributes) => {
    try {  
        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product ID not found.');
            throw new Error('Product ID not found.');
        }

        const productAttributes = await ProductAttributes.findOne({productId: productId});

        if (productAttributes) {
            const deleteAction = await deleteAttributes(productId);
        } else {
            console.log('Attributes for product Id are not existed.');
            throw new Error('Attributes for product Id are not existed.');
        }

        const categoryAttributes = await findAttributes(categoryId);

        if (!categoryAttributes) {
            console.log('This product requires no attributes.');
            throw new Error('This product requires no attributes.');
        }

        let catCount = 0;

        for (const category of categoryAttributes) {
            if (category.required) {
                catCount++;
            }
        }

        const data = [];
        let dataCount = 0;
        for (const attribute of attributes) {
            const matchValue = categoryAttributes.find(catAttr => catAttr.name === attribute.name);

            if (!matchValue) {
                console.log(`Invalid attribute description '${attribute.name}'.`);
                throw new Error(`Invalid attribute description '${attribute.name}'.`);
            }

            if (matchValue.required) {
                if (!attribute.value || typeof attribute.value.description !== matchValue.type) {
                    console.log(`Invalid type '${attribute.type}' for attribute.`);
                    throw new Error(`Invalid type '${attribute.type}' for attribute.`);
                }
                dataCount++;
            }

            data.push({
                name: attribute.name,
                value: {
                    description: attribute.value.description,
                    type: attribute.value.type
                },
                required: attribute.required
            }); 
        }

        if (dataCount < catCount) {
            console.log('Invalid attributes. The number of attributes are less than required.');
            throw new Error('Invalid attributes. The number of attributes are less than required.');
        }

        const newProductAttributes = new ProductAttributes ({
            productId: productId,
            attributes: data
        });

        await newProductAttributes.save();

        return newProductAttributes;
    } catch (err) {
        console.log('Unable to create attributes for products', err.stack);
        throw new Error('Unable to create attributes for products');
    }
}

module.exports = {recreateAttributes}