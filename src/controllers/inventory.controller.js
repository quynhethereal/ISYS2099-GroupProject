const Inventory = require('../models/inventory.model');
const moveInventoryService = require('../services/moveInventory.service');
exports.getAll = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const inventory = await Inventory.getAllInventory();
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving inventory."
        });
    }
}

exports.moveInventory = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { productId, fromWarehouse, toWarehouse, quantity } = req.body;

        // validate presence of params
        if (productId === null || fromWarehouse === null || toWarehouse === null || quantity === null) {
            res.status(400).send({
                message: "Invalid request."
            });
            return;
        }

        // validate quantity
        if (quantity <= 0) {
            res.status(400).send({
                message: "Invalid quantity."
            });
            return;
        }

        const result = await moveInventoryService.moveInventory( productId, fromWarehouse, toWarehouse, quantity);

        res.status(200).json(result);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Error moving inventory."
        });
    }
}
