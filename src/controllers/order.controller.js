const createOrderService = require('../services/createOrder.service');

// example payload
// {
//     "cart": [
//     { "productId": 1, "quantity": 10 },
//     { "productId": 2, "quantity": 5 },
//     { "productId": 3, "quantity": 2 }
// ]
// }

exports.createOrder = async (req, res) => {
    // TODO: validate params
    try {
        const cart = req.body.cart;

        const params = {
            userId: parseInt(req.currentUser.id),
            order: cart,
        }
        const order = await createOrderService.createOrder(params);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating order."
        });
    }
}