const Inventory = require('../models/inventory.model');
const { admin_pool } = require('../db/db');
const Warehouse = require('../models/warehouse.model');
const checkWarehouseCapacityService = require('./checkWarehouseCapacity.service');

// example params
// {
//     "fromWarehouse": 1,
//     "toWarehouse": 2,
//     "productId": 3,
//     "quantity": 10
// }
exports.moveInventory = async (productId, fromWarehouse, toWarehouse, quantity) => {
    const connection = await admin_pool.promise().getConnection();

    try {
        await connection.query('BEGIN');

        // sort the ids to avoid deadlocks
        const warehouseIds = [fromWarehouse, toWarehouse].sort((a, b) => a - b);

        const getWarehouseQuery = await connection.execute('SELECT * FROM `warehouses` where id in (?,?) FOR SHARE', [warehouseIds[0], warehouseIds[1]]);

        // build warehouse array objects
        const warehouses = getWarehouseQuery[0].map(warehouse => new Warehouse(warehouse));

        if (warehouses.length !== 2) {
            throw new Error('Unable to find warehouses.');
        }

        // get inventory and product size info of fromWarehouse
        const fromWarehouseInventory = await connection.execute('SELECT i.id, i.product_id, i.quantity, i.reserved_quantity, p.length, p.width, p.height FROM products p join inventory i on i.product_id = p.id WHERE i.warehouse_id = ? AND p.id = ? FOR UPDATE', [fromWarehouse, productId]);

        if (fromWarehouseInventory[0].length === 0) {
            throw new Error('Unable to find inventory.');
        }

        // if fromWarehouse doesn't have enough inventory, throw error
        if (fromWarehouseInventory[0][0].quantity < quantity) {
            throw new Error('Not enough inventory to move.');
        }

        // check if toWarehouse has enough space for the product
        const checkParams = {
            toWarehouseCapacity: warehouses.find(warehouse => warehouse.id === toWarehouse).available_volume,
            toWarehouseInventory: {
                quantity: quantity,
                height: fromWarehouseInventory[0][0].height,
                width: fromWarehouseInventory[0][0].width,
                length: fromWarehouseInventory[0][0].length,
            },
        }

        const isEnoughSpace = checkWarehouseCapacityService(checkParams);

        if (!isEnoughSpace) {
            throw new Error('Not enough space in the intended warehouse.');
        }

        // check if toWarehouse alr has inventory of the product, if not create new one
        const toWarehouseInventory = await connection.execute('SELECT * FROM `inventory` WHERE warehouse_id = ? AND product_id = ? FOR UPDATE', [toWarehouse, productId]);

        if (toWarehouseInventory[0].length === 0) {
            await connection.execute('INSERT INTO `inventory` (product_id, warehouse_id, quantity, reserved_quantity) VALUES (?, ?, ?, ?)', [productId, toWarehouse, 0, 0]);
        }

        // update inventory of toWarehouse
        const moveInventoryQuery = await connection.execute('UPDATE `inventory` SET quantity = quantity + ?, reserved_quantity = reserved_quantity + ? WHERE warehouse_id = ? AND product_id = ?', [quantity, fromWarehouseInventory[0][0].reserved_quantity, toWarehouse, productId]);

        // obtain lock
         await connection.execute('SELECT * FROM `inventory` WHERE warehouse_id = ? AND product_id = ? FOR UPDATE', [fromWarehouse, productId]);

        const updateFromWarehouseInventoryQuery = await connection.execute('UPDATE `inventory` SET quantity = quantity - ?, reserved_quantity = reserved_quantity - ? WHERE warehouse_id = ? AND product_id = ?', [quantity, fromWarehouseInventory[0][0].reserved_quantity, fromWarehouse, productId]);

        if (moveInventoryQuery[0].affectedRows === 0 || updateFromWarehouseInventoryQuery[0].affectedRows === 0) {
            throw new Error('Unable to move inventory.');
        }

        // update the order items that have inventory_id of fromWarehouse
        const affectedOrderItemsQuery = await connection. execute("SELECT * FROM `order_items` WHERE inventory_id = ? AND order_id IN (SELECT id FROM `orders` WHERE status = 'pending') FOR UPDATE", [fromWarehouseInventory[0][0].id]);

        if (affectedOrderItemsQuery[0].length > 0) {
            const updateOrderItemsQuery = await connection.execute('UPDATE `order_items` SET inventory_id = ? WHERE inventory_id = ? AND order_id IN (SELECT id FROM `orders` WHERE status = "pending")', [toWarehouseInventory[0][0].id, fromWarehouseInventory[0][0].id]);

            if (updateOrderItemsQuery[0].affectedRows === 0) {
                throw new Error('Unable to update order items.');
            }
        }

        await connection.query('COMMIT');
        console.log('Transaction committed.');

        return {
            message: 'Inventory moved successfully.',
        }

    } catch (err) {
        console.log('Unable to move inventory.');
        await connection.query('ROLLBACK');

        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}
