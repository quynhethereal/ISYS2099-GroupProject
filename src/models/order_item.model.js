class OrderItem {
    constructor(params = {}) {
        this.orderId = params.orderId;
        this.productId = params.productId;
        this.quantity = params.quantity;
        this.inventoryId = params.inventoryId;
        this.title = params.title;
        this.description = params.description;
        this.image = params.image;
    }
}

module.exports = OrderItem;
