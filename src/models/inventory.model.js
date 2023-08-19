const {admin_pool} = require("../db/db");

class Inventory {
    constructor(params = {}) {
        this.id = params.id;
        this.productId = params.product_id;
        this.quantity = params.quantity - params.reserved_quantity;
        this.warehouseId = params.warehouse_id;
    }
}

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
        console.log('Unable to find inventory.');
        // rethrow error
        throw err;
    }
}

Inventory.getCountAll = async () => {
    try {
        return new Promise(async (resolve, reject) => {
            await admin_pool.execute('SELECT COUNT(*) FROM `inventory`', (err, results) => {
                if (err) {
                    console.log('There is no warehouse with the inventory the requirements.');
                    reject(err);
                    return;
                }
                console.log("Inventory found.");
                resolve(results[0]['COUNT(*)']);
            });
        });
    } catch
        (err) {
        console.log('Unable to find inventory.');
        // rethrow error
        throw err;
    }
}

Inventory.getAllInventory = async (params) => {
    const connection = await admin_pool.promise().getConnection();
    try {
        const limit = parseInt(params?.limit) || 10;
        const currentPage = parseInt(params?.currentPage) || 1;
        const offset = (currentPage - 1) * limit;
        const inventoryCount = await Inventory.getCountAll();
        const totalPages = Math.ceil(inventoryCount / limit);

        const [rows] = await connection.execute("SELECT * FROM `inventory` i JOIN products p WHERE p.id = i.product_id order by i.ID ASC LIMIT ?,?", [offset + "", limit + ""]);

        return {
            inventoryCount: inventoryCount,
            inventory: rows,
            limit: limit,
            currentPage: currentPage,
            totalPages: totalPages
        };

    } catch (err) {
        console.log('Unable to find inventory.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}

Inventory.getCountByWarehouseId = async (warehouseId) => {
    try {
        return new Promise(async (resolve, reject) => {
            await admin_pool.execute('SELECT COUNT(*) FROM `inventory` WHERE warehouse_id = ?', [warehouseId], (err, results) => {
                if (err) {
                    console.log('There is no warehouse with the inventory the requirements.');
                    reject(err);
                    return;
                }
                console.log("Inventory found.");
                resolve(results[0]['COUNT(*)']);
            });
        });
    } catch
        (err) {
        console.log('Unable to find inventory.');
        // rethrow error
        throw err;
    }
}

Inventory.getInventoryByWarehouseId = async (params) => {
    const connection = await admin_pool.promise().getConnection();
    try {
        const limit = parseInt(params.limit) || 10;
        const currentPage = parseInt(params.currentPage) || 1;
        const offset = (currentPage - 1) * limit;
        const inventoryCount = await Inventory.getCountByWarehouseId(params.warehouseId);
        const totalPages = Math.ceil(inventoryCount / limit);

        const [rows] = await connection.execute("SELECT * FROM `inventory` i JOIN products p WHERE p.id = i.product_id AND i.warehouse_id = ? ORDER BY i.ID ASC LIMIT ?,?", [params.warehouseId, offset + "", limit + ""]);


        return {
            inventoryCount: inventoryCount,
            inventory: rows,
            limit: limit,
            currentPage: currentPage,
            totalPages: totalPages
        };
    } catch (err) {
        console.log('Unable to find inventory.');
        // rethrow error
        console.log(err.stack);
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = Inventory;
