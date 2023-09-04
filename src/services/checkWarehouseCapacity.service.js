// this func check if toWarehouse has enough space to store the product to be moved
// example payload
// {
//     "toWarehouseCapacity": 1000.0,
//     "toWarehouseInventory": {
//         "quantity": 5,
//         "height": 10.0,
//         "width": 10.0,
//         "length": 10.0
//     },
const checkWarehouseCapacityService = (params) => {
    try {

        const {toWarehouseCapacity} = params;

        // Cast strings to floats
        const toWarehouseCapacityFloat = parseFloat(toWarehouseCapacity);
        const quantityFloat = parseFloat(params.toWarehouseInventory.quantity);
        const heightFloat = parseFloat(params.toWarehouseInventory.height);
        const widthFloat = parseFloat(params.toWarehouseInventory.width);
        const lengthFloat = parseFloat(params.toWarehouseInventory.length);

        // check NaN values
        if (isNaN(toWarehouseCapacityFloat) || isNaN(quantityFloat) || isNaN(heightFloat) || isNaN(widthFloat) || isNaN(lengthFloat)) {
            throw new Error('Invalid input.');
        }

        // Calculate the total volume of the product to be moved
        const totalVolume = quantityFloat * heightFloat * widthFloat * lengthFloat;

        // Check if the target warehouse has enough capacity
        return toWarehouseCapacityFloat >= totalVolume;
    } catch (err) {
        throw new Error(err.message);
    }
}


module.exports = checkWarehouseCapacityService;
