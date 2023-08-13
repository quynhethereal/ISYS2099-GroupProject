const createOrderService = require('../services/createOrder.service');
const checkForDuplicateProductIds = require('../validators/createOrder.validator').checkForDuplicateProductIds;
const Order = require('../models/order.model');
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

        // Validate the payload for duplicate product IDs
        const hasDuplicates = checkForDuplicateProductIds(cart);

        if (hasDuplicates) {
            return res.status(400).json({ message: "Payload contains duplicate product IDs." });
        }

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

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAll(req.currentUser.id);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving orders."
        });
    }
}

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.getById(req.params.id, req.currentUser.id);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving order."
        });
    }
}