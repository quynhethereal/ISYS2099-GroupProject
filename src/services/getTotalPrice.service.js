
// sample input
// [
//     { order_quantity: 5, price: '1499.99' },
//     { order_quantity: 2, price: '49.95' }
// ]
const getTotalPrice = (productList) => {
    console.log(productList);
    let totalPrice = 0;
    for (const product of productList) {
        totalPrice += product.order_quantity * product.price;
    }
    console.log(totalPrice);
    console.log("aaja")
    return totalPrice;
}

module.exports = { getTotalPrice };