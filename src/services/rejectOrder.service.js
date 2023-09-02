const {admin_pool} = require('../db/db');
const Order = require("../models/order.model");
const rejectOrder = async (orderId, userId) => {
    const connection = await admin_pool.promise().getConnection();
    try {
        // check if user is authorized to accept order. In reality, should use RBAC to check if user is authorized to accept order.
        const [rows] = await connection.execute("SELECT * FROM `orders` WHERE id = ? AND user_id = ? AND status = 'pending'", [orderId, userId]);

        if (rows.length === 0) {
            throw new Error('Order not found.');
        }

        // await connection.query('call update_inventory_on_order_reject(?)', [orderId]);

        // query again to get the updated order
        const res = await connection.execute("UPDATE orders SET STATUS = 'rejected' WHERE id = ? AND user_id = ?", [orderId, userId]);

        if (res[0].changedRows === 1) {
            return {
                message: 'Order rejected.',
            }
        } else {
            throw new Error('Cannot reject order.....')
        }
    } catch (err) {
        console.log('Unable to reject order.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = rejectOrder;
