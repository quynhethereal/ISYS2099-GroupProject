// Function to check for duplicate product IDs in the payload

// sample payload

// "cart": [
//     { "productId": 1, "quantity": 200 },
//     { "productId": 2, "quantity": 5 },
//     { "productId": 3, "quantity": 2 }
// ]

exports.checkForDuplicateProductIds = (cart) => {
    const productIds = new Set();

    for (const item of cart) {
        if (productIds.has(item.productId)) {
            return true; // Found a duplicate
        }
        productIds.add(item.productId);
    }

    return false; // No duplicates found
};