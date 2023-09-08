const Product = require('../models/product.model');
const {recreateAttributes} = require('./recreateAttributes.service');
const {seller_pool} = require('../db/db');
const {findProductAttributes} = require('../models/product_attributes.model');

// example payload
// {
//   "name": "Updated Product Name",
//   "description": "Updated product description.",
//   "price": 29.99,
//   "image": "updated.jpg",
//   "category": "Electronics"
// }

const update = async (params) => {
    try {
        // validate params
        productValidator.validateUpdateParams(params);
        const title = params.title + "";
        const description = params.description + "";
        const price = parseFloat(params.price);
        const category = params.category;
        const id = params.productId;
        const image = params.image;
        const attributes = params.attributes;

        const product = await Product.findByIdAndSellerId(id, params.sellerId);

        if (!product) {
            console.log("Product not found.");
            throw new Error("Product not found or you are not the owner of this product.");
        } else {
            const promise = await new Promise((resolve, reject) => {
                seller_pool.execute(
                    'UPDATE `products` SET title = ?, description = ?, price = ?, category_id = ?, image = ? WHERE id = ?',
                    [title, description, price, category, image, id],
                    (err, results) => {
                        if (err) {
                            console.log('Unable to update product.');
                            reject(err);
                            return;
                        }
                        console.log("Product updated.");
                        resolve(results);
                    }
                );
            });

            if (!promise) {
                const updateAttributes = await recreateAttributes(id, category, attributes);
            
                if (!updateAttributes) {
                    console.log('Unable to recreate product attributes.');
                    throw new Error('Unable to recreate product attributes.');
                }
            }
        }

        const newProduct = new Product(params);

        const newAttributes = await findProductAttributes(id);

        return {
            product: newProduct,
            attributes: newAttributes
        }

    } catch (err) {
        console.log(err.stack)
        console.log('Unable to update product.');
        throw err;
    }
}

module.exports = {update}