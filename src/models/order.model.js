const {customer_pool} = require("../db/db");
const OrderItem = require("./order_item.model");


class Order {
    constructor(params = {}) {
        this.id = params.id;
        this.userId = params.user_id;
        this.totalPrice = params.total_price;
        this.status = params.status;
        this.orderItems = [];
    }
}

Order.isValidStatus = (status) => {
    return ['pending', 'accepted', 'rejected'].includes(status);
}

Order.getAll = async (userId, status) => {
    const connection = await customer_pool.promise().getConnection();

    try {
        const [rows] = await connection.execute('SELECT * FROM `orders` WHERE user_id = ? AND STATUS = ?', [userId, status]);

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

// get order and order items and product ids
Order.getById = async (orderId, userId) => {
    const connection = await customer_pool.promise().getConnection();

    try {
        const [rows] = await connection.execute('SELECT * FROM `orders` WHERE id = ? AND user_id = ? ', [orderId, userId]);

        if (rows.length === 0) {
            console.log('Order not found.');
            return {};
        }

        const order = new Order(rows[0]);

        const [orderItems] = await connection.execute('SELECT p.title, o.quantity as order_quantity, p.description FROM `order_items` o JOIN inventory i ON o.inventory_id = i.id JOIN products p ON i.product_id = p.id WHERE order_id = ?', [orderId]);

        for (const row of orderItems) {
            const orderItem = new OrderItem(row);
            orderItem.quantity = row.order_quantity;
            order.orderItems.push(orderItem);
        }

        return order;

    } catch (err) {
        console.log('Unable to get order.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = Order;
