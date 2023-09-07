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
                if (!attribute.value || typeof attribute.value.description !== matchValue.type) {
                    console.log(`Invalid type '${attribute.type}' for attribute.`);
                    throw new Error(`Invalid type '${attribute.type}' for attribute.`);
                }
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

const findByKey = async (key) => {
    try {
        const regex = new RegExp(key, 'i'); // case sensitive

        const data = await ProductAttributes.find({'attributes.value.description': regex});

        if (data.length > 0) {
            const result = data.map(d => d.attributes.filter(attr => regex.test(attr.name)));
            return result;
        }

        return null;
    } catch (err) {
        console.log('Unable to find key.');
        throw new Error('Unable to find key.');
    }
}

const findAllAttributes = async () => {
    try {
        const products = await ProductAttributes.find({});
        const attributeValuesMap = {};

        products.forEach((product) => {
            product.attributes.forEach((attr) => {
                const attributeName = attr.name;
                const attributeValues = attr.value.description;

                if (attributeValues.length == 0) {
                    return;
                }

                if (attributeName in attributeValuesMap) {
                    attributeValuesMap[attributeName].push(attributeValues);
                } else {
                    attributeValuesMap[attributeName] = [attributeValues];
                }
            });
        });

        return attributeValuesMap;
    } catch (err) {
        console.log('Unable to fetching description following the list of attributes');
        throw new Error('Unable to fetching description following the list of attributes');
    }
}

const findAllAttributesByCat = async (id) => {
    try {
        const categoryAttributes = await findAttributes(id);

        // console.log(categoryAttributes);
        if (!categoryAttributes) {
            console.log('No avalable category attributes.');
            throw new Error('No avalable category attributes.');
        }

        const products = await ProductAttributes.find({});
        const attributeValuesMap = {};

        products.forEach((product) => {
            product.attributes.forEach((attr) => {
                const attributeName = attr.name;
                const attributeValues = attr.value.description;

                if (categoryAttributes.some((attribute) => attribute.name === attributeName)) {
                    if (attributeValues.length == 0){
                        return;
                    }

                    if (attributeName in attributeValuesMap) {
                        attributeValuesMap[attributeName].push(attributeValues);
                    } else {
                        attributeValuesMap[attributeName] = [attributeValues];
                    }   
                }
            });
        });

        return attributeValuesMap;
    } catch (err) {
        console.log('Unable to fetching description following the list of attributes');
        throw new Error('Unable to fetching description following the list of attributes');
    }
}

const updateCurrentAttributes = async (productId, attributes) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product Id not found!');
            throw new Error('Product Id not found.');
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
                name: attribute.name,
                value: {
                    description: attribute.value.description,
                    type: attribute.value.type
                },
                required: attribute.required
            }); 
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
            const restoreAction = await createAttributes(productId, categoryId, result);
            console.log('Fail to update attributes');
            throw new Error('Fail to update attributes');
        }

        return newAttributes;
    } catch (err) {
        console.log('Unable to update attributes when changing category.');
        throw new Error('Unable to update attributes when changing category.');
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
    findByKey, 
    findAllAttributes,
    findAllAttributesByCat,
    updateCurrentAttributes, 
    updateAttributes, 
    deleteAttributes
};

