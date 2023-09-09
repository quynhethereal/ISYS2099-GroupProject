const {admin_pool} = require("../db/db");
const Order = require("../models/order.model");
const Inventory = require("../models/inventory.model");
const OrderItem = require("../models/order_item.model");
const {checkAllInventory} = require("./checkInventory.service");
const {getTotalPrice} = require("./getTotalPrice.service");

const CreateOrderService = {};
// params
// {  "userId": 1,
//     "order": [
//     { "productId": 1, "quantity": 10 },
//     { "productId": 2, "quantity": 5 },
//     { "productId": 3, "quantity": 2 }
// ]
CreateOrderService.createOrder = async (params) => {
    // check if product has enough quantity
    const connection = await admin_pool.promise().getConnection();

    try {
        let transactionResult = {};
        transactionResult.unfulfilledProducts = [];

        await connection.query('BEGIN');
        // build Order object
        const orderQuery = await connection.execute('INSERT INTO `orders` (`user_id`) VALUES (?)', [params.userId]);

        const order = new Order();
        order.id = orderQuery[0].insertId;
        order.userId = params.userId;

        for (const row of params.order) {
            const orderItem = new OrderItem();
            orderItem.orderId = order.id;
            orderItem.productId = row.productId;
            orderItem.quantity = row.quantity;
            order.orderItems.push(orderItem);
        }

        // sort this first to avoid deadlock
        const productIds = params.order.map(item => item.productId).sort((a, b) => a - b);

        const inventoriesResult = await connection.query('SELECT * FROM inventory WHERE product_id IN (?) ORDER BY product_id ASC FOR UPDATE', [productIds]);

        // build Inventory list
        const inventories = [];
        for (const row of inventoriesResult[0]) {
            const inventory = new Inventory(row);
            inventories.push(inventory);
        }

        // get inventory mapping for each order item
        const inventoryMapping = checkAllInventory(order, inventories);

        // create order item records + update the inventories in the database
        for (const productId in inventoryMapping) {
            if (inventoryMapping[productId].length === 0) {
                transactionResult.unfulfilledProducts.push(parseInt(productId));
                continue;
            }

            for (const inventory of inventoryMapping[productId]) {
                const updateInventoryQuery = await connection.execute('UPDATE inventory SET reserved_quantity = reserved_quantity + ? WHERE product_id = ? AND warehouse_id = ?', [inventory.quantity, productId, inventory.warehouseId]);

                // create order item record
                await connection.query('INSERT INTO order_items (inventory_id, order_id, quantity) VALUES (?,?,?)', [inventory.inventoryId, order.id, inventory.quantity]);
            }
        }

        // if the order contains only unfulfilledProducts, roll back
        if (transactionResult.unfulfilledProducts.length === params.order.length) {
            console.log("All products are unfulfilled. Rolling back...");
            await connection.query('ROLLBACK');
            return transactionResult;
        }

        // calculate total price
        const productPriceQuery = await connection.execute('SELECT o.quantity AS order_quantity, p.price FROM order_items o join inventory i on o.inventory_id = i.id join products p on i.product_id = p.id WHERE o.order_id = ? FOR UPDATE', [order.id]);

        // calculate total price
        transactionResult.totalPrice = getTotalPrice(productPriceQuery[0]);

        // update order record with total price
        await connection.execute('UPDATE orders SET total_price = ? WHERE id = ?', [transactionResult.totalPrice, order.id]);

        // add orderId to transactionResult
        transactionResult.orderId = order.id;

        // finally, commit transaction
        await connection.query('COMMIT');
        console.log('Transaction committed.');

        return transactionResult;

    } catch (err) {
        console.log("Error creating order. Rolling back...")
        await connection.query('ROLLBACK');
        throw err;
    } finally {
        console.log('Return connection to pool.')
        connection.release();
    }
}


module.exports = CreateOrderService;
