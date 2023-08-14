const Inventory = require('../../models/inventory.model');
const OrderItem = require('../../models/order_item.model');
const Order = require('../../models/order.model');
const {checkInventoryForOrderItem} = require('../../services/checkInventory.service');

describe('checkInventoryForOrderItem', () => {
    it('should correctly allocate inventory for order', () => {
        const orderItem = new OrderItem();
        orderItem.productId = 1;
        orderItem.quantity = 100;

        const inventory1 = new Inventory();
        inventory1.id = "UniqueID1"
        inventory1.warehouseId = 1;
        inventory1.productId = 1;
        inventory1.quantity = 50;

        const inventory2 = new Inventory();
        inventory2.id = "UniqueID2"
        inventory2.warehouseId = 4;
        inventory2.productId = 1;
        inventory2.quantity = 50;

        const inventoryArray = [
            inventory1, inventory2
        ];

        const result = checkInventoryForOrderItem(orderItem, inventoryArray);

        expect(result).toEqual({
            1: [
                {warehouseId: 1, quantity: 50, inventoryId: "UniqueID1"},
                {warehouseId: 4, quantity: 50, inventoryId: "UniqueID2"}
            ]
        });
    });

    it('should correctly allocate inventory when the first warehouse have enough inventory', () => {
        const orderItem = new OrderItem();
        orderItem.productId = 1;
        orderItem.quantity = 100;

        const inventory1 = new Inventory();
        inventory1.warehouseId = 1;
        inventory1.productId = 1;
        inventory1.quantity = 100;
        inventory1.id = "UniqueID1"

        const inventory2 = new Inventory();
        inventory2.warehouseId = 4;
        inventory2.productId = 1;
        inventory2.quantity = 50;
        inventory2.id = "UniqueID2"


        const inventoryArray = [
            inventory1, inventory2
        ];

        const result = checkInventoryForOrderItem(orderItem, inventoryArray);

        expect(result).toEqual({
            1: [
                {warehouseId: 1, quantity: 100, inventoryId: "UniqueID1"},
            ]
        });
    });

    it('should handle insufficient inventory', () => {
        const orderItem = new OrderItem();
        orderItem.productId = 1;
        orderItem.quantity = 100;

        const inventory1 = new Inventory();
        inventory1.warehouseId = 1;
        inventory1.productId = 1;
        inventory1.quantity = 50;

        const inventory2 = new Inventory();
        inventory2.warehouseId = 4;
        inventory2.productId = 1;
        inventory2.quantity = 0;

        const inventoryArray = [
            inventory1, inventory2
        ];

        const result = checkInventoryForOrderItem(orderItem, inventoryArray);

        expect(result).toEqual({
            1: []
        });
    });
});

