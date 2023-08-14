const Warehouse = require('../models/warehouse.model.js');
const {validateCreateWarehousePayload }  = require('../validators/createWarehouse.validator');

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
