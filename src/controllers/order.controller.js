const createOrderService = require('../services/createOrder.service');
const acceptOrderService = require('../services/acceptOrder.service');
const rejectOrderService = require('../services/rejectOrder.service');
const validateCart = require('../validators/createOrder.validator').validateCartPayload;
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
        const isValid = validateCart(cart);

        if (!isValid) {
            return res.status(400).json({message: "Cart's payload is invalid. Maximum 30 items are allowed per order and cart shouldn't contain duplicate product IDs"});
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
        // validate status
        if (req.query.status && !Order.isValidStatus(req.query.status)) {
            return res.status(400).json({message: "Invalid status."});
        }

        let status = req.query.status;

        if (req.query.status === undefined) {
            status = 'pending';
        }

        const orders = await Order.getAll(req.currentUser.id, status);
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

exports.acceptOrder = async (req, res) => {
    try {
        const order = await acceptOrderService(req.params.id, req.currentUser.id);

        res.status(200).json(order);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error accepting order."
        });
    }
}

exports.rejectOrder = async (req, res) => {
    try {
        const order = await rejectOrderService(req.params.id, req.currentUser.id);

        res.status(200).json(order);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error rejecting order."
        });
    }
}
