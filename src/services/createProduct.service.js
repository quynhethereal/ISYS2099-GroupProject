const {seller_pool} = require('../db/db');
const Product = require('../models/product.model');
const {createAttributes} = require('../models/product_attributes.model');
const {deleteAttributes} = require('../services/deleteProduct.service');

const create = async (params) => {
    const connection = await seller_pool.promise().getConnection();

    try {
        const {title, description, price, category, sellerId, image, length, width, height, attributes} = params;

        const imageName = params.imageName || 'default_prod_image.jpg';

        const insertProductQuery = await connection.execute(
            'INSERT INTO `products` (title, description, price, category_id, seller_id, image, image_name, length, width, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, price, category, sellerId, image, imageName, length, width, height]
        );

        const productId = insertProductQuery[0].insertId;

        const productAttributes = await createAttributes(productId, category, attributes);

        if (!productAttributes) {
            console.log('Unable to create product attributes.');
            throw new Error('Unable to create product attributes.');
        }

        const product = new Product({
            title,
            description,
            price,
            category,
            sellerId,
            image,
            imageName,
            productId,
            length,
            width,
            height
        });

        if (!product) {
            await deleteAttributes(productId);
            console.log('Unable to create new product.');
            throw new Error('Unable to create new product.');
        } 

        return {
            product: product,
            productAttributes: productAttributes.attributes
        }
    } catch (err) {
        console.log('Unable to create product.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = {create}