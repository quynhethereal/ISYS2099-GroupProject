const mongoose = require('mongoose');
const {Category, findAttributes} = require('./category.model.js'); 
const Product = require('./product.model');

const AttributeSchema = new mongoose.Schema ({
    productId: Number, 
    attributes: [
        {
            name: String, 
            value: {
                description: {
                    type: mongoose.Schema.Types.Mixed,
                }, 
                type: {
                    type: String, 
                    enum:['string','number'],
                }
            },
            required: {
                type: Boolean,
                required: true
            }
        }
    ]
});

const ProductAttributes = mongoose.model('ProductAttributes', AttributeSchema);

/*
Task need to do, create, read, update, delete, search by keyword, return list of description based on name of attributes

Create: Read the attributes requirements from findAttributes
*/

const createAttributes = async (productId, categoryId, attributes) => {
    try {  
        const product = await Product.findById(productId);
        if (!product) {
            console.log('Product ID not found.');
            throw new Error('Product ID not found.');
        }

        const categoryAttributes = await findAttributes(categoryId);

        if (!categoryAttributes) {
            console.log('This product requires no attributes.');
            throw new Error('This product requires no attributes.');
        }

        const data = [];
        for (const attribute of attributes) {
            const matchValue = categoryAttributes.find(catAttr => catAttr.name === attribute.name);

            if (!matchValue) {
                console.log(`Invalid attribute description '${attribute.name}'.`);
                throw new Error(`Invalid attribute description '${attribute.name}'.`);
            }

            if (matchValue.required) {
                if (!attribute.value || typeof attribute.value.description !== matchingAttribute.type) {
                    console.log(`Invalid type '${attribute.type}' for attribute.`);
                    throw new Error(`Invalid type '${attribute.type}' for attribute.`);
                }
            }

            data.push({
                name: matchValue.name,
                value: {
                    description: attribute.value.description,
                    type: attribute.value.type
                },
                required: attribute.name
            }); 
        }

        const newProductAttributes = new ProductAttributes ({
            id: productId,
            attributes: data
        });

        await newProductAttributes.save();

        return newProductAttributes;
    } catch (err) {
        console.log('Unable to create attributes for products');
        throw new Error('Unable to create attributes for products');
    }
}

const findProductAttributes = async (id) => {
    try {
        const product = await ProductAttributes.findOne({productId: id});

        if (!product) {
            console.log('Product ID not found.');
            throw new Error('Product ID not found.');
        }

        const attributes = product.attributes;

        return attributes;
    } catch (err) {
        console.log('Unable to retrieve attributes for product.');
        throw new Error('Unable to retrieve attributes for product.');
    }
}

// TODO
const findByKey = async (key) => {
    try {

    } catch (err) {
        console.log('Unable to find key.');
        throw new Error('Unable to find key.');
    }
}

// TODO
const findByName = async (name) => {
    try {

    } catch (err) {
        console.log('Unable to find by attribute name.');
        throw new Error('Unable to find by attribute name.');
    }
}

const updateAttributes = async (productId, categoryId, attributes) => {
    try {
        const result = await findProductAttributes(productId);

        if (!result) {
            console.log('No matching attributes in database');
            throw new Error('No matching attributes in database');
        }

        const deleteAction = await deleteAttributes(productId);

        const newAttributes = await createAttributes(productId, categoryId, attributes);

        if(!newAttributes) {
            console.log('Fail to update attributes');
            throw new Error('Fail to update attributes');
        }

        return newAttributes;
    } catch (err) {
        console.log('Unable to update attributes.');
        throw new Error('Unable to update attributes.');
    }
}

const deleteAttributes = async (id) => {
    try {
        const product = await ProductAttributes.find({productId: id});

        if (!product) {
            console.log('No available product attributes to delete.');
            throw new Error('No available product attributes to delete.');
        }

        const deleteAction = await ProductAttributes.deleteOne({productId: id});

        if (deleteAction.deletedCount > 0) {
            console.log('Delete successful!');
        } else {
            console.log('Fail to delete!');
        }
    } catch (err) {
        console.log('Unable to delete attributes.');
        throw new Error('Unable to delete attributes.');
    }
}

module.exports = {ProductAttributes, createAttributes, findProductAttributes, updateAttributes, deleteAttributes};

