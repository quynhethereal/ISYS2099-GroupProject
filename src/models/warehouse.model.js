const {admin_pool} = require("../db/db");
class Warehouse {
    constructor(params = {}) {
        this.name = params.name;
        this.province = params.province;
        this.city = params.city;
        this.district = params.district;
        this.street = params.street;
        this.number = params.number;
        this.total_volume = params.total_volume;
        this.available_volume = params.available_volume;
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

Warehouse.create = async (params) => {
    const connection = await admin_pool.promise().getConnection();

    try {
        const {name, province, city, district, street, number, total_volume, available_volume} = params;

        const warehouse = new Warehouse({name, province, city, district, street, number, total_volume, available_volume});

        const insertWarehouseQuery = await connection.execute(
            'INSERT INTO `warehouses` (name, province, city, district, street, number, total_volume, available_volume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [warehouse.name, warehouse.province, warehouse.city, warehouse.district, warehouse.street, warehouse.number, warehouse.total_volume, warehouse.available_volume]
        );

        if (insertWarehouseQuery[0].affectedRows === 0) {
            throw new Error('Unable to create warehouse.');
        } else {
            console.log('Warehouse created.');
            return {
                message: 'Warehouse created.',
                warehouse: warehouse
            }
        }
    } catch (err) {
        console.log('Unable to create warehouse.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}

// select count of warehouses
Warehouse.count = async () => {
    const connection = await admin_pool.promise().getConnection();

    try {
        const [rows] = await connection.execute("SELECT COUNT(*) as count FROM `warehouses`");

        return rows[0].count;
    } catch (err) {
        console.log('Unable to count warehouses.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}

// use pagination
Warehouse.findAll = async (params) => {
    const connection = await admin_pool.promise().getConnection();

    try {
        console.log(params);
        const limit = parseInt(params.limit) || 10;
        const currentPage = parseInt(params.currentPage) || 1;

        const offset = (currentPage - 1) * limit;

        const total = await Warehouse.count();
        const totalPages = Math.ceil(total / limit);

        const [rows] = await connection.execute("SELECT * FROM `warehouses` ORDER BY ID ASC LIMIT ?,?", [offset + "", limit +""]);

        if (rows.length === 0) {
            throw new Error('No warehouses found.');
        }

        return {
            totalWarehouseCount: total,
            limit: limit,
            currentPage: currentPage,
            totalPages: totalPages,
            warehouses: rows
        }
    } catch (err) {
        console.log('Unable to find warehouses.');
        // rethrow error
        throw err;
    } finally {
        connection.release();
    }
}


module.exports = Warehouse;
