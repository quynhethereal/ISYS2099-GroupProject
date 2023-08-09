const connection = require("../db/db");

class Product {
    constructor(params) {
        this.name = params.name;
        this.description = params.description;
        this.price = params.price;
        this.quantity = params.quantity;
        this.image = params.image;
        // TODO: add category
        this.category = params.category;
    }
}

Product.findById = (productId) => {
    return new Promise((resolve, reject) => {
        connection.execute(
            'SELECT * FROM `products` WHERE id = ?',
            [productId],
            (err, results) => {
                if (err) {
                    console.log('Unable to find product.');
                    reject(err);
                    return;
                }

                if (results.length === 0) {
                    console.log('No product with this id.');
                    resolve(null);
                    return;
                }

                const product = results[0];
                console.log("Product found.");
                resolve(product);
            }
        );
    });
}

Product.count = () => {
    return new Promise((resolve, reject) => {
        connection.execute(
            'SELECT COUNT(*) as count FROM `products`',
            (err, results) => {
                if (err) {
                    console.log('Unable to count products.');
                    reject(err);
                    return;
                }

                const count = results[0].count;
                console.log("Counted products.");
                resolve(count);
            }
        );
    });
}

// use pagination
// example params = {limit: 10, offset: 0, category: 1 }
Product.findByCategory = async (params) => {
    try {
        const limit = parseInt(params.limit) || 10;
        const offset = parseInt(params.offset) || 0;
        const productCount = await Product.count();

        const totalPages = Math.ceil(productCount / limit);

        const res = await new Promise((resolve, reject) => {
            connection.execute(
                "SELECT * FROM `products` WHERE category_id = ? ORDER BY id DESC LIMIT ?,?",
                [params.category + "", offset + "", limit + ""],
                (err, results) => {
                    if (err) {
                        console.log('Unable to find products.');
                        reject(err);
                        return;
                    }
                    resolve(results);
                }
            );
        });

        return {
            products: res,
            limit: limit,
            offset: offset,
            totalPages: totalPages,
        };

    } catch (err) {
        console.log('Unable to find products.');
        throw err;
    }
}

module.exports = Product;