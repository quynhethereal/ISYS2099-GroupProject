const {ProductAttributes} = require('../models/product_attributes.model');
const Product = require('../models/product.model');
const {seller_pool} = require('../db/db');

const deleteProduct = async (productId, sellerId) => {
    // check if product under seller exists
    const product = await Product.findByIdAndSellerId(productId, sellerId);

    if (!product) {
        console.log("Product not found.");
        throw new Error("Product not found.");
    }

    // if there is still pending order for this product, do not delete
    const pendingOrder = await new Promise((resolve, reject) => {
        seller_pool.execute(
            'SELECT distinct o.id, o.status FROM `orders` o JOIN order_items oi ON oi.order_id = o.id JOIN inventory i ON oi.inventory_id = i.id JOIN products p ON i.product_id = ?  WHERE o.status = "pending"',
            [productId],
            (err, results) => {
                if (err) {
                    console.log('Unable to find pending orders.');
                    reject(err);
                    return;
                }
                resolve(results);
            }
        );
    });

    if (pendingOrder.length > 0) {
        console.log("There is still pending order for this product.");
        throw new Error("There is still pending order for this product. Delete cannot be performed.");
    }

    // delete product by setting the order status to 'deleted' and delete the project
    await new Promise((resolve, reject) => {
        seller_pool.execute(
            'DELETE FROM `products` WHERE id = ?',
            [productId],
            (err, results) => {
                if (err) {
                    console.log('Unable to delete product.');
                    reject(err);
                    return;
                }
                console.log("Product deleted.");
                resolve(results);
            }
        );  

       
    });

    await deleteAttributes(productId);
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

module.exports = {deleteAttributes, deleteProduct}
