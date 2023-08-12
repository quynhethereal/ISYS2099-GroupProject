const {admin_pool} = require("../db/db");
const Inventory = {}


Inventory.getProductInventory = async (params) => {
    try {
        const {productId, quantity} = params;

        return new Promise(async (resolve, reject) => {
            await admin_pool.execute('SELECT * FROM `inventory` WHERE product_id = ? AND quantity >= ?', [productId, quantity], (err, results) => {
                if (err) {
                    console.log('There is no warehouse with the inventory the requirements.');
                    reject(err);
                    return;
                }
                console.log("Inventory found.");
                resolve(results);
            });
        });
    } catch
        (err) {
        console.log('Unable to update product image.');
        // rethrow error
        throw err;
    }
}