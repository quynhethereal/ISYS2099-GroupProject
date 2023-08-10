const admin_pool = require("../db/db");


const CreateOrderService = {};

CreateOrderService.createOrder = (params) => {
    // check if product has enough quantity
    try {
        admin_pool.getConnection(function (err, connection) {
            connection.beginTransaction(function (err) {
                if (err) {
                    connection.rollback(function () {
                        connection.release();
                        throw err;
                    });
                } else {
                    try {
                        // check if inventory has enough quantity
                        connection.query('SELECT * FROM inventory WHERE product_id = ? AND QUANTITY >= ?', [params.productId, params.quantity], function (err, rows) {
                            if (err) {
                                console.log('Error selecting from inventory table.');
                                connection.rollback(function () {
                                    connection.release();
                                    throw err;
                                });
                            }

                            if (!rows) {
                                console.log('No inventory satisfying the order found.');
                                connection.rollback(function () {
                                    connection.release();
                                    throw err;
                                });
                            }
                            if (rows && rows.length > 0) {
                                console.log('Inventory found. Creating order.');

                            }
                        });
                    } catch (err) {
                        console.log(err);
                        throw err;
                    }
                    finally {
                        console.log("Done transaction. Return the connection to the pool.");
                        connection.release();
                    }
                }
                return {
                    message: "Order created successfully."
                }

            });
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = CreateOrderService;