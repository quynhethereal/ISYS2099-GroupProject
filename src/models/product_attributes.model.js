const mongoose = require('mongoose');
const {findAttributes} = require('./category.model.js'); 
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

const createAttributes = async (productId, categoryId, attributes) => {
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

const updateCurrentAttributes = async (productId, attributes) => {
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

        const productCatId = parseInt(product.category_id);

        if (!productCatId) {
            console.log('Unable to find product category Id!');
            throw new Error('Unable to find product category Id!')
        }

        const categoryAttributes = await findAttributes(productCatId);

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

        const updateData = await ProductAttributes.findOneAndUpdate({productId: productId}, {attributes: data}, {new: true});

        if (!updateData) {
            console.log('Error in updating data.');
            throw new Error('Error in updating data.');
        }

        return updateData;
    } catch (err) {
        console.log('Unable to update attributes with current cat.');
        throw new Error('Unable to update attributes with current cat.');
    }
}

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

module.exports = {
    ProductAttributes, 
    createAttributes, 
    findAll, 
    findProductAttributes, 
    updateCurrentAttributes, 
    recreateAttributes,
    deleteAttributes
};

