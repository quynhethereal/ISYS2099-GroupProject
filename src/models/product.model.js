const {customer_pool, seller_pool} = require("../db/db");
const productValidator = require('../validators/product.validator');
const path = require('path');
const Helpers = require('../helpers/helpers');

class Product {
    constructor(params = {}) {
        this.name = params.name;
        this.description = params.description;
        this.price = params.price;
        // this.image = params.image;
        // TODO: add category
        this.category = params.category;
    }
}

Product.findById = (productId) => {
    return new Promise((resolve, reject) => {
        customer_pool.execute(
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
        customer_pool.execute(
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

Product.countByCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
        customer_pool.execute(
            'SELECT COUNT(*) as count FROM `products` WHERE category_id = ?',
            [categoryId],
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

Product.countBySellerID = (sellerId) => {
    return new Promise((resolve, reject) => {
        customer_pool.execute(

            'SELECT COUNT(*) as count FROM `products` WHERE seller_id = ?',
            [sellerId],
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

// use offset - limit
Product.findBySellerId = async (params) => {
    try {
        const limit = parseInt(params.queryParams.limit) || 10;
        const currentPage = parseInt(params.queryParams.currentPage) || 1;
        const offset = (currentPage - 1) * limit;
        const productCount = await Product.countBySellerID(params.sellerId);
        const totalPages = Math.ceil(productCount / limit);

        const res = await new Promise((resolve, reject) => {
            seller_pool.execute(
                "SELECT * FROM `products` WHERE seller_id = ? ORDER BY id ASC LIMIT ?,?",
                [params.sellerId, offset +"", limit+""],
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
            currentPage: currentPage,
            totalPages: totalPages,
            totalProductCount: productCount
        }
        
    } catch (err) {
        console.log(err.stack);
        console.log('Unable to find products.');
        throw err;
    } 

}

// use offset - limit
// example params = { category: 1, limit: 10, currentPage: 1 }
Product.findByCategory = async (params) => {
    try {
        const limit = parseInt(params.queryParams.limit) || 10;
        const currentPage = parseInt(params.queryParams.currentPage) || 1;
        const categoryId = parseInt(params.categoryId) || 1;
        const offset = (currentPage - 1) * limit;
        const productCount = await Product.countByCategory(categoryId);
        const totalPages = Math.ceil(productCount / limit);
        
        const sortTerm = params.queryParams.sortTerm;
        const sortDirection = params.queryParams.sortDirection;

        const res = await new Promise((resolve, reject) => {
            customer_pool.execute(
                `SELECT * FROM \`products\` WHERE category_id = ? ORDER BY ${sortTerm} ${sortDirection} LIMIT ?,?`,
                [categoryId + "", offset + "", limit + ""],
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
            currentPage: currentPage,
            totalPages: totalPages,
            totalProductCount: productCount
        }
    } catch (err) {
        console.log('Unable to find products.');
        throw err;
    }
}

// use largestID for infinite scrolling landing page
Product.findAll = async (params) => {
    try {
        const limit = parseInt(params.limit) || 10;
        const nextId = parseInt(params.nextId) || 0;
        const categoryId = parseInt(params.categoryId) || 1;

        const productCount = await Product.count();

        const totalPages = Math.ceil(productCount / limit);

        const res = await new Promise((resolve, reject) => {
            customer_pool.execute(
                "SELECT * FROM `products` WHERE id > ? ORDER BY id ASC LIMIT ?",
                [nextId + "", limit + ""],
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
            totalProductCount: productCount
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

        seller_pool.execute(
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

        seller_pool.execute(
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

        seller_pool.execute(
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

        seller_pool.execute(
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
                seller_pool.execute(
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

        seller_pool.execute(
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
        const title = params.title + "";
        const description = params.description + "";
        const price = parseFloat(params.price);
        const category = params.category + "";
        const id = params.productId;
        const image = params.image;


        const product = await Product.findById(id);

        // TODO: check if category is valid

        if (!product) {
            console.log("Product not found.");
            throw new Error("Product not found.");
        } else {
            await new Promise((resolve, reject) => {
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
        }

        return new Product(params);

    } catch (err) {
        console.log('Unable to update product.');
        throw err;
    }
}

Product.getImage = async (productId) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            console.log("Product not found.");
            throw new Error("Product not found.");
        } else {
            const imageQuery = await new Promise((resolve, reject) => {
                seller_pool.execute(
                    'SELECT image, image_name FROM `products` WHERE id = ?',
                    [productId],
                    (err, results) => {
                        if (err) {
                            console.log('Unable to get product image.');
                            reject(err);
                            return;
                        }
                        console.log("Product image retrieved.");
                        resolve(results);
                    }
                );
            });

        // write to file
            const defaultFilePath = path.join(__dirname, '../..', 'public', 'uploads', 'images', imageQuery[0].image_name);
            Helpers.decodeImage(imageQuery[0].image, defaultFilePath);

            return {
                message: "Product image retrieved.",
                imagePath: defaultFilePath,
                imageName: imageQuery[0].image_name
            }
        }
    } catch (err) {
        console.log('Unable to get product image.');
        // rethrow error
        throw err;
    }
}

Product.countByPriceRange = (minPrice, maxPrice) => {
    return new Promise((resolve, reject) => {
        customer_pool.execute(
            'SELECT COUNT(*) as count FROM `products` WHERE price >= ? AND price <= ?',
            [minPrice, maxPrice],
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

Product.findByPriceRange = async (params) => {
    try {
        const limit = parseInt(params.queryParams.limit) || 10;
        const currentPage = parseInt(params.queryParams.currentPage) || 1;
        
        const sortTerm = params.queryParams.sortTerm;
        const sortDirection = params.queryParams.sortDirection;

        const minPrice = parseFloat(params.queryParams.minPrice) || 0;
        const maxPrice = parseFloat(params.queryParams.maxPrice) || Number.MAX_VALUE;

        const offset = (currentPage - 1) * limit;
        const productCount = await Product.countByPriceRange(minPrice, maxPrice);
        const totalPages = Math.ceil(productCount / limit);

        const res = await new Promise((resolve, reject) => {

            customer_pool.execute(
                `SELECT * FROM \`products\` WHERE price BETWEEN ? AND ? ORDER BY ${sortTerm} ${sortDirection} LIMIT ?,?`,
                [minPrice, maxPrice, offset + "", limit + ""],
                (err, results) => {
                    if (err) {
                        console.log('Unable to find products.');
                        reject(err);
                        return;
                    }
                    resolve(results);
                }
            )
        });

        return {
            products: res,
            limit: limit,
            currentPage: currentPage,
            totalPages: totalPages,
            totalProductCount: productCount
        };
    } catch (err) {
        console.log('Unable to find products.');
        throw err;
    }
}

// Search keyword in title and description
Product.findByKey = async (params) => {
    try {
        const sortTerm = params.queryParams.sortTerm;
        const sortDirection = params.queryParams.sortDirection;
        const key = params.queryParams.key;

        const res = await new Promise((resolve, reject) => {
            customer_pool.execute(
                `SELECT * FROM \`products\`
                WHERE MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)
                ORDER BY ${sortTerm} ${sortDirection}`,
                [key],
                (err, results) => {
                    if (err) {
                        console.log('Unable to search products');
                        reject(err);
                        return;
                    }
                    resolve(results);
                }
            );
        });

        return {
            products: res,
            totalProductCount: res.length
        };
    } catch (err) {
        console.log('Unable to search products.');
    }
}

module.exports = Product;
