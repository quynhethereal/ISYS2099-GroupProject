const Warehouse = require('../models/warehouse.model.js');
const {validateCreateWarehousePayload }  = require('../validators/createWarehouse.validator');
const Inventory = require('../models/inventory.model');
exports.create = async (req, res) => {
    try {

        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // validate params
        const isValid = validateCreateWarehousePayload(req.body);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid payload." });
        }

        const warehouse = await Warehouse.create(req.body);
        res.status(200).json(warehouse);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating warehouse."
        });
    }
}

exports.getInventoryByWarehouseId = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const warehouseId = req.params.id;
        const params = {
            warehouseId: warehouseId,
            ...req.query
        }
        const inventory = await Inventory.getInventoryByWarehouseId(params);
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving warehouse."
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const warehouses = await Warehouse.findAll(req.query);
        res.status(200).json(warehouses);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving warehouses."
        });
    }
}

exports.findById = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const warehouse = await Warehouse.findById(parseInt(req.params.id));
        if (!warehouse) {
            res.status(404).send({
                message: `Warehouse with id ${req.params.id} not found.`
            });
            return;
        }
        res.status(200).json(warehouse);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving warehouse."
        });
    }
}

exports.delete = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const warehouseId = parseInt(req.params.id);
        const warehouse = await Warehouse.delete(warehouseId);
        res.status(200).json(warehouse);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error deleting warehouse."
        });
    }
}

exports.update = async (req, res) => {
    try {
        // check if user is admin
        if (req.currentUser.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const warehouseId = parseInt(req.params.id);
        const warehouse = await Warehouse.update(warehouseId, req.body);
        res.status(200).json(warehouse);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error updating warehouse."
        });
    }
}
