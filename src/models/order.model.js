const OrderStatus = {
    CREATED: 'created',
    ACCEPT: 'accept',
    CANCEL: 'cancel',
};
class Order {
    constructor(params={}) {
        this.id = params.id;
        this.userId = params.user_id;
        this.totalPrice = 0;
        this.status = OrderStatus.CREATED;
        this.orderItems = [];
    }
}

module.exports = Order;