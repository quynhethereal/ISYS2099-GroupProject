// Function to validate cart:
// - check for duplicate product IDs in the payload
// - cart should only have < 30 items && > 0 item

// sample payload

// "cart": [
//     { "productId": 1, "quantity": 200 },
//     { "productId": 2, "quantity": 5 },
//     { "productId": 3, "quantity": 2 }
// ]

exports.validateCartPayload = (cart) => {
    if (cart.length > 30 || cart.length === 0) {
        return false;
    }

    const productIds = new Set();

    for (const item of cart) {
        if (item.quantity <= 0) {
            return false;
        }

        if (productIds.has(item.productId)) {
            return false // Found a duplicate
        }
        productIds.add(item.productId);
    }

    return true;
};