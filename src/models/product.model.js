const {admin_pool} = require("../db/db");
const productValidator = require('../validators/product.validator');

class Product {
    constructor(params) {
        this.name = params.name;
        this.description = params.description;
        this.price = params.price;
        this.image = params.image;
        // TODO: add category
        this.category = params.category;
    }
}

Product.findById = (productId) => {
    return new Promise((resolve, reject) => {
        admin_pool.execute(
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
        admin_pool.execute(
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
// example params = { category: 1, largestId: 10, limit: 10 }
Product.findByCategory = async (params) => {
    try {
        const limit = parseInt(params.limit) || 10;
        const nextId = parseInt(params.nextId) || 0;
        const categoryId = parseInt(params.categoryId) || 1;

        const productCount = await Product.count();

        const totalPages = Math.ceil(productCount / limit);

        const res = await new Promise((resolve, reject) => {
            admin_pool.execute(
                "SELECT * FROM `products` WHERE category_id = ? AND id > ? ORDER BY id ASC LIMIT ?",
                [categoryId + "", nextId + "", limit + ""],
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

        // get max ID from results
        // return 1 means that results is empty
        const resNextId = res.reduce((max, p) => p.id > max ? p.id : max, -1);

        return {
            products: res,
            limit: limit,
            nextId: resNextId,
            totalPages: totalPages,
        };

    } catch (err) {
        console.log('Unable to find products.');
        throw err;
    }
}

Product.updateName = (params) => {
    const {name, id} = params;

    productValidator.validateName(name);

    Product.findById(id).then((product) => {
        if (!product) {
            console.log("Product not found.");
            return;
        }

        admin_pool.execute(
            'UPDATE `products` SET name = ? WHERE id = ?',
            [name, id],
            (err, results) => {
                if (err) {
                    console.log('Unable to update product.');
                    return;
                }
                console.log("Product updated.");
                return results;
            }
        );
    });
}

Product.updateDescription = (params) => {
    const {description, id} = params;

    productValidator.validateDescription(description);

    Product.findById(id).then((product) => {
        if (!product) {
            console.log("Product not found.");
            return;
        }

        admin_pool.execute(
            'UPDATE `products` SET description = ? WHERE id = ?',
            [description, id],
            (err, results) => {
                if (err) {
                    console.log('Unable to update product.');
                    return;
                }
                console.log("Product updated.");
                return results;
            }
        );
    });
}

Product.updatePrice = (params) => {
    const {price, id} = params;

    productValidator.validatePrice(price);

    Product.findById(id).then((product) => {
        if (!product) {
            console.log("Product not found.");
            return;
        }

        admin_pool.execute(
            'UPDATE `products` SET price = ? WHERE id = ?',
            [price, id],
            (err, results) => {
                if (err) {
                    console.log('Unable to update product.');
                    return;
                }
                console.log("Product updated.");
                return results;
            }
        );
    });
}

Product.updateQuantity = (params) => {
    const {quantity, id} = params;

    productValidator.validateQuantity(quantity);

    Product.findById(id).then((product) => {
        if (!product) {
            console.log("Product not found.");
            return;
        }

        admin_pool.execute(
            'UPDATE `products` SET quantity = ? WHERE id = ?',
            [quantity, id],
            (err, results) => {
                if (err) {
                    console.log('Unable to update product.');
                    return;
                }
                console.log("Product updated.");
                return results;
            }
        );
    });
}

Product.updateImage = async (params) => {
    try {
        const product = await Product.findById(params.productId);

        if (!product) {
            console.log("Product not found.");
            throw new Error("Product not found.");
        } else {
            await new Promise((resolve, reject) => {
                admin_pool.execute(
                    'UPDATE `products` SET image = ?, image_name = ? WHERE id = ?',
                    [params.image, params.imageName, params.productId],
                    (err, results) => {
                        if (err) {
                            console.log('Unable to update product.');
                            reject(err);
                            return;
                        }
                        console.log("Product image updated.");
                        resolve(results);
                    }
                );
            });
        }

        return {
            productId: params.productId,
            imageName: params.imageName,
        };
    } catch (err) {
        console.log('Unable to update product image.');
        // rethrow error
        throw err;
    }
};


Product.updateCategory = (params) => {
    Product.findById(params.id).then((product) => {
        if (!product) {
            console.log("Product not found.");
            return;
        }

        admin_pool.execute(
            'UPDATE `products` SET category = ? WHERE id = ?',
            [params.category, params.id],
            (err, results) => {
                if (err) {
                    console.log('Unable to update product.');
                    return;
                }
                console.log("Product updated.");
                return results;
            }
        );
    });
}


// example payload
// {
//   "name": "Updated Product Name",
//   "description": "Updated product description.",
//   "price": 29.99,
//   "image": "updated.jpg",
//   "category": "Electronics"
// }

Product.update = async (params) => {
    try {
        // validate params
        productValidator.validateUpdateParams(params);
        console.log(params);
        const title = params.title + "";
        const description = params.description + "";
        const price = parseFloat(params.price);
        const category = params.category + "";
        const id = params.productId;

        console.log(price);

        const product = await Product.findById(id);

        if (!product) {
            console.log("Product not found.");
        } else {
            await new Promise((resolve, reject) => {
                admin_pool.execute(
                    'UPDATE `products` SET title = ?, description = ?, price = ?, category_id = ? WHERE id = ?',
                    [title, description, price, category, id],
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
        }

        return new Product(params);

    } catch (err) {
        console.log('Unable to update product.');
        throw err;
    }
}

module.exports = Product;