const Order = require('../models/order.model');
const OrderItem = require('../models/order_item.model');
const Inventory = require("../models/inventory.model");

// this service takes in two parameters:
// Order object which specifies the order details
// Inventory array that specifies the stock details for each product in the order
const checkAllInventory = (order, inventory) => {
    let result = {};
    for (const orderItem of order.orderItems) {
        const inventoryItem = inventory.filter(item => item.productId === orderItem.productId);

        result = {...checkInventoryForOrderItem(orderItem, inventoryItem), ...result};
    }
    return result;
}

const checkInventoryForOrderItem = (orderItem, inventoryArray) => {
    let result = {};
    result[orderItem.productId] = [];

    let orderQuantity = orderItem.quantity;

    while (orderQuantity > 0) {
        const inventoryItem = inventoryArray.shift();

        // we do not have enough inventory to fulfill the order
        if (!inventoryItem && orderQuantity > 0) {
            result[orderItem.productId] = [];
            break;
        }

        // if the quantity in this inventory is enough or more than enough to fulfill the order
        if (inventoryItem.quantity >= orderQuantity) {
            result[orderItem.productId].push({warehouseId: inventoryItem.warehouseId, quantity: orderQuantity, inventoryId: inventoryItem.id})
            orderQuantity -= inventoryItem.quantity;
        } else {
            result[orderItem.productId].push({warehouseId: inventoryItem.warehouseId, quantity: inventoryItem.quantity, inventoryId: inventoryItem.id})
            orderQuantity -= inventoryItem.quantity;
        }

    }
    return result;
}

module.exports = {checkInventoryForOrderItem, checkAllInventory};
