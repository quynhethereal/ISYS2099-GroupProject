const {customer_pool} = require("../db/db");

const OrderStatus = {
    CREATED: 'created',
    ACCEPT: 'accept',
    CANCEL: 'cancel',
};

class Order {
    constructor(params = {}) {
        this.id = params.id;
        this.userId = params.user_id;
        this.totalPrice = 0;
        this.status = OrderStatus.CREATED;
        this.orderItems = [];
    }
}

Order.getAll = async (userId) => {
    const connection = await customer_pool.promise().getConnection();

    try {
        const [rows] = await connection.execute('SELECT * FROM `orders` WHERE user_id = ?', [userId]);

        const orders = [];
        for (const row of rows) {
            const order = new Order(row);
            orders.push(order);
        }
        return orders;
    } catch (err) {
        console.log('Unable to get orders.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}

Order.getById = async (orderId, userId) => {
    const connection = await customer_pool.promise().getConnection();

    try {
        const [rows] = await connection.execute('SELECT * FROM `orders` WHERE id = ? AND user_id = ?', [orderId, userId]);

        if (rows.length === 0) {
            console.log('Order not found.');
            return {message: "Order not found."};
        }
        return new Order(rows[0]);
    } catch (err) {
        console.log('Unable to get order.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = Order;