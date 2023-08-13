const {admin_pool} = require('../db/db');
const Order = require("../models/order.model");
const acceptOrder = async (orderId, userId) => {
    const connection = await admin_pool.promise().getConnection();
    try {
        // check if user is authorized to accept order. In reality, should use RBAC to check if user is authorized to accept order.
        const [rows] = await connection.execute("SELECT * FROM `orders` WHERE id = ? AND user_id = ? AND status = 'pending'", [orderId, userId]);

        if (rows.length === 0) {
            throw new Error('Order not found.');
        }

        await connection.query('call update_inventory_on_order_accept(?)', [orderId]);

        // query again to get the updated order
        const [res] = await connection.execute("SELECT * FROM `orders` WHERE id = ? AND user_id = ?", [orderId, userId]);

        if (res[0].status === 'accepted') {
            return {
                message: 'Order accepted.',
                order: new Order(res[0])
            }
        } else {
            throw new Error('Cannot accept order.....')
        }
    } catch (err) {
        console.log('Unable to accept order.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = acceptOrder;