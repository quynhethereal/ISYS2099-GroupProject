const Order = require("../../models/order.model");
const OrderItem = require("../../models/order_item.model");
const Inventory = require("../../models/inventory.model");
const {checkAllInventory} = require("../../services/checkInventory.service");
describe('checkAllInventory', () => {
    it('should correctly allocate inventory for order', () => {
        const order = new Order();
        order.id = 1;

        const orderItem1 = new OrderItem();
        orderItem1.id = 1;
        orderItem1.orderId = 1;
        orderItem1.productId = 1;
        orderItem1.quantity = 100;

        const orderItem2 = new OrderItem();
        orderItem2.id = 2;
        orderItem2.orderId = 1;
        orderItem2.productId = 2;
        orderItem2.quantity = 100;

        order.orderItems = [orderItem1, orderItem2];

        const inventory1 = new Inventory();
        inventory1.warehouseId = 1;
        inventory1.productId = 1;
        inventory1.quantity = 50;
        inventory1.id = "UniqueID1"


        const inventory2 = new Inventory();
        inventory2.warehouseId = 4;
        inventory2.productId = 1;
        inventory2.quantity = 50;
        inventory2.id = "UniqueID2"


        const inventory3 = new Inventory();
        inventory3.warehouseId = 1;
        inventory3.productId = 2;
        inventory3.quantity = 50;
        inventory3.id = "UniqueID3"


        const inventory4 = new Inventory();
        inventory4.warehouseId = 4;
        inventory4.productId = 2;
        inventory4.quantity = 50;
        inventory4.id = "UniqueID4";


        const inventoryArray = [
            inventory1, inventory2, inventory3, inventory4
        ];

        const result = checkAllInventory(order, inventoryArray);

        expect(Object.keys(result)).toEqual(['1', '2']);

        expect(result).toEqual({
            '1': [
                {warehouseId: 1, quantity: 50, inventoryId: "UniqueID1"},
                {warehouseId: 4, quantity: 50, inventoryId: "UniqueID2"}
            ],
            '2': [
                {warehouseId: 1, quantity: 50, inventoryId: "UniqueID3"},
                {warehouseId: 4, quantity: 50, inventoryId: "UniqueID4"}
            ]
        });
    });

    it('should correctly allocate inventory when the first warehouse have enough inventory', () => {
        const order = new Order();
        order.id = 1;
        order.orderItems = [
            {
                id: 1,
                productId: 1,
                quantity: 100
            },
            {
                id: 2,
                productId: 2,
                quantity: 100
            }
        ];

        const inventory1 = new Inventory();
        inventory1.warehouseId = 1;
        inventory1.productId = 1;
        inventory1.quantity = 100;

        const inventory2 = new Inventory();
        inventory2.warehouseId = 4;
        inventory2.productId = 1;
        inventory2.quantity = 50;

        const inventory3 = new Inventory();
        inventory3.warehouseId = 1;
        inventory3.productId = 2;
        inventory3.quantity = 50;

        const inventory4 = new Inventory();
        inventory4.warehouseId = 4;
        inventory4.productId = 2;
        inventory4.quantity = 50;

        const inventoryArray = [
            inventory1, inventory2, inventory3, inventory4
        ];

        const result = checkAllInventory(order, inventoryArray);

        expect(result).toEqual({
            1: [
                {warehouseId: 1, quantity: 100},
            ],
            2: [
                {warehouseId: 1, quantity: 50},
                {warehouseId: 4, quantity: 50}
            ]
        });
    });

    it('should handle insufficient inventory', () => {
        const order = new Order();
        order.id = 1;
        order.orderItems = [
            {
                id: 1,
                productId: 1,
                quantity: 100
            },
            {
                id: 2,
                productId: 2,
                quantity: 100
            }
        ];

        const inventory1 = new Inventory();
        inventory1.warehouseId = 1;
        inventory1.productId = 1;
        inventory1.quantity = 50;

        const inventory2 = new Inventory();
        inventory2.warehouseId = 4;
        inventory2.productId = 1;
        inventory2.quantity = 0;

        const inventory3 = new Inventory();
        inventory3.warehouseId = 1;
        inventory3.productId = 2;
        inventory3.quantity = 50;

        const inventory4 = new Inventory();
        inventory4.warehouseId = 4;
        inventory4.productId = 2;
        inventory4.quantity = 50;

        const inventoryArray = [
            inventory1, inventory2, inventory3, inventory4
        ];

        const result = checkAllInventory(order, inventoryArray);

        expect(result).toEqual({
            1: [],
            2: [
                {warehouseId: 1, quantity: 50},
                {warehouseId: 4, quantity: 50}
            ]
        });
    });

    it('should handle insufficient inventory for all order items', () => {
        const order = new Order();
        order.id = 1;
        order.orderItems = [
            {
                id: 1,
                productId: 1,
                quantity: 100
            },
            {
                id: 2,
                productId: 2,
                quantity: 100
            }
        ];

        const inventory1 = new Inventory();
        inventory1.warehouseId = 1;
        inventory1.productId = 1;
        inventory1.quantity = 50;
        inventory1.id = "UniqueID1"

        const inventory2 = new Inventory();
        inventory2.warehouseId = 4;
        inventory2.productId = 1;
        inventory2.quantity = 0;
        inventory2.id = "UniqueID2"

        const inventory3 = new Inventory();
        inventory3.warehouseId = 1;
        inventory3.productId = 2;
        inventory3.quantity = 50;
        inventory3.id = "UniqueID3"

        const inventory4 = new Inventory();
        inventory4.warehouseId = 4;
        inventory4.productId = 2;
        inventory4.quantity = 0;
        inventory4.id = "UniqueID4"

        const inventoryArray = [
            inventory1, inventory2, inventory3, inventory4
        ];

        const result = checkAllInventory(order, inventoryArray);

        expect(result).toEqual({
            1: [],
            2: []
        });
    });

    it('should handle correct inventory when there are multiple warehouses with enough inventory', () => {
        const order = new Order();
        order.id = 1;
        order.orderItems = [
            {
                id: 1,
                productId: 1,
                quantity: 100
            },
            {
                id: 2,
                productId: 2,
                quantity: 100
            }
        ];

        const inventory1 = new Inventory();
        inventory1.warehouseId = 1;
        inventory1.productId = 1;
        inventory1.quantity = 50;

        const inventory2 = new Inventory();
        inventory2.warehouseId = 4;
        inventory2.productId = 1;
        inventory2.quantity = 100;

        const inventory3 = new Inventory();
        inventory3.warehouseId = 1;
        inventory3.productId = 2;
        inventory3.quantity = 50;

        const inventory4 = new Inventory();
        inventory4.warehouseId = 4;
        inventory4.productId = 2;
        inventory4.quantity = 150;

        const inventoryArray = [
            inventory1, inventory2, inventory3, inventory4
        ];

        const result = checkAllInventory(order, inventoryArray);

        expect(result).toEqual({
            1: [
                {warehouseId: 1, quantity: 50},
                {warehouseId: 4, quantity: 50}
            ],
            2: [
                {warehouseId: 1, quantity: 50},
                {warehouseId: 4, quantity: 50}
            ]
        });
    });
});