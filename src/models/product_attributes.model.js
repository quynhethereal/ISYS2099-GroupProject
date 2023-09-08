const mongoose = require('mongoose');
const {findAttributes} = require('./category.model.js'); 
const Product = require('./product.model');

const AttributeSchema = new mongoose.Schema ({
    productId: {
        type: Number,
        index: 1
    }, 
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

const createAttributes = async (productId, categoryId, attributes) => {
    console.log('attributes', attributes);
    try {  
        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product ID not found.');
            throw new Error('Product ID not found.');
        }

        const productAttributes = await ProductAttributes.findOne({productId: productId});

        if (productAttributes) {
            console.log('Attributes for product Id are existed.');
            throw new Error('Attributes for product Id are existed.');
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
                if (matchValue.type === 'number') {
                    attribute.value.description = parseInt(attribute.value.description);
                }

                if (!attribute.value || typeof attribute.value.description !== matchValue.type) {
                    console.log(`Invalid type '${attribute.type}' for attribute.`);
                    throw new Error(`Invalid type '${attribute.type}' for attribute.`);
                }
                dataCount++;
            }

            if (!matchValue.required) {
                if (matchValue.type === 'number') {
                    attribute.value.description = parseInt(attribute.value.description);
                }

                if (typeof attribute.value.description !== matchValue.type) {
                    console.log(`Invalid type '${attribute.type}' for attribute.`);
                    throw new Error(`Invalid type '${attribute.type}' for attribute.`);
                }
            }

            data.push({
                name: matchValue.name,
                value: {
                    description: attribute.value.description,
                    type: matchValue.type
                },
                required: matchValue.required
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

const findAll = async () => {
    try {
        const attributes = await ProductAttributes.find();
        return attributes;
    } catch (err) {
        console.log('Unable to find all product attributes');
        throw new Error('Unable to find all product attributes');
    }
}

const findProductAttributes = async (id) => {
    try {
        const product = await ProductAttributes.findOne({productId: id});

        console.log(product);
        if (!product) {
            console.log('Product attributes not found.');
            throw new Error('Product attributes not found.');
        }

        const data = product.attributes;

        return data;
    } catch (err) {
        console.log('Unable to retrieve attributes for product.', err.stack);
        throw new Error('Unable to retrieve attributes for product.');
    }
}

const updateCurrentAttributes = async (productId, categoryId, attributes) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product Id not found!');
            throw new Error('Product Id not found.');
        }

        const productAttributes = await ProductAttributes.findOne({productId: productId});

        if (!productAttributes) {
            console.log('Attributes for product Id is not existed.');
            throw new Error('Attributes for product Id is not existed.');
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
        console.log('attribute in model', attributes);
        for (const attribute of attributes) {
            const matchValue = categoryAttributes.find(catAttr => catAttr.name === attribute.name);

            if (!matchValue) {
                console.log(`Invalid attribute description '${attribute.name}'.`);
                throw new Error(`Invalid attribute description '${attribute.name}'.`);
            }

            if (matchValue.required) {
                if (matchValue.type === 'number') {
                    attribute.value.description = parseInt(attribute.value.description);
                }

                if (!attribute.value || typeof attribute.value.description !== matchValue.type) {
                    console.log(`Invalid type '${attribute.type}' for attribute.`);
                    throw new Error(`Invalid type '${attribute.type}' for attribute.`);
                }
                dataCount++;
            }

            if (!matchValue.required) {
                if (matchValue.type === 'number') {
                    attribute.value.description = parseInt(attribute.value.description);
                }

                if (typeof attribute.value.description !== matchValue.type) {
                    console.log(`Invalid type '${attribute.type}' for attribute.`);
                    throw new Error(`Invalid type '${attribute.type}' for attribute.`);
                }
            }

            data.push({
                name: matchValue.name,
                value: {
                    description: attribute.value.description,
                    type: matchValue.type
                },
                required: matchValue.required
            }); 
        }

        if (dataCount < catCount) {
            console.log('Invalid attributes. The number of attributes are less than required.');
            throw new Error('Invalid attributes. The number of attributes are less than required.');
        }

        const updateData = await ProductAttributes.findOneAndUpdate({productId: productId}, {attributes: data}, {new: true});

        if (!updateData) {
            console.log('Error in updating data.');
            throw new Error('Error in updating data.');
        }

        return updateData;
    } catch (err) {
        console.log('Unable to update attributes with current cat.', err.stack);
        throw new Error('Unable to update attributes with current cat.');
    }
}

module.exports = {
    ProductAttributes, 
    createAttributes, 
    findAll, 
    findProductAttributes, 
    updateCurrentAttributes
};

