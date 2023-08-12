const {admin_pool} = require("../db/db");
class Warehouse {
    constructor(params) {
        this.name = params.name;
        this.description = params.description;
        this.address = params.address;
        this.length = params.length;
        this.width = params.width;
    }
}

Warehouse.findById = (warehouseId) => {
    return new Promise((resolve, reject) => {
        admin_pool.execute(
            'SELECT * FROM `warehouses` WHERE id = ?',
            [warehouseId],
            (err, results) => {
                if (err) {
                    console.log('Unable to find warehouse.');
                    reject(err);
                    return;
                }

                if (results.length === 0) {
                    console.log('No warehouse with this id.');
                    resolve(null);
                    return;
                }

                const warehouse = results[0];
                console.log("Warehouse found.");
                resolve(warehouse);
            }
        );
    });
}
