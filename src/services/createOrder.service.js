const {admin_pool} = require("../db/db");


const CreateOrderService = {};

CreateOrderService.createOrder = (params) => {
    // check if product has enough quantity
    try {
        admin_pool.getConnection(function (err, connection) {
            admin_pool.beginTransaction(function (err) {
                if (err) {
                    admin_pool.rollback(function () {
                        admin_pool.release();
                        throw err;
                    });
                } else {
                    try {
                        // check if inventory has enough quantity
                        admin_pool.query('SELECT * FROM inventory WHERE product_id = ? AND QUANTITY >= ?', [params.productId, params.quantity], function (err, rows) {
                            if (err) {
                                console.log('Error selecting from inventory table.');
                                admin_pool.rollback(function () {
                                    admin_pool.release();
                                    throw err;
                                });
                            }

                            if (!rows) {
                                console.log('No inventory satisfying the order found.');
                                admin_pool.rollback(function () {
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
                        admin_pool.release();
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