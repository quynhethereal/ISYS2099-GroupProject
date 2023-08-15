const Inventory = require('../models/inventory.model');

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
