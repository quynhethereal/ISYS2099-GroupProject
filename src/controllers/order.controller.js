const createOrderService = require('../services/createOrder.service');

exports.createOrder = async (req, res) => {
    // TODO: validate params
    try {
        const productId = parseInt(req.params.id);
        const params = {
            productId: productId,
            ... req.body
        }
        const order = await createOrderService.createOrder(params);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating order."
        });
    }
}