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

        // validate that two warehouses are not the same
        if (fromWarehouse === toWarehouse) {
            res.status(400).send({
                message: "Cannot move inventory from and to the same warehouse."
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

exports.updateInventory = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'seller') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // check if quantity is valid
        if (req.body.quantity < 0 || req.body.quantity === null || req.body.quantity === undefined) {
            return res.status(400).json({ message: "Invalid quantity." });
        }

        const inventory = await Inventory.updateInventory(req.params.id, req.body.quantity);

        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error updating inventory."
        });
    }
}

exports.getPendingInventory = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const inventory = await Inventory.getPendingInventory(req.query);
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving inventory."
        });
    }
}

exports.getInventoryByProductId = async (req, res) => {
    try {
        // check if user is seller
        if (req.currentUser.role !== 'seller') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const inventory = await Inventory.getInventoryByProductId(req.params.id);
        if (inventory === null) {
            return res.status(404).json({ message: "Inventory not found." });
        }
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving inventory."
        });
    }
}
