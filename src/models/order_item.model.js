class OrderItem {
    constructor(params = {}) {
        this.orderId = params.orderId;
        this.productId = params.productId;
        this.quantity = params.quantity;
        this.inventoryId = params.inventoryId;
    }
}

module.exports = OrderItem;
