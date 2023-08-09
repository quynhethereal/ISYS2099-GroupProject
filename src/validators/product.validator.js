const ProductValidator = {};

ProductValidator.validateName = (name) => {
    if (!name || name.trim() === '') {
        throw new Error('Product name is required');
    }
};

ProductValidator.validateDescription = (description) => {
    if (!description || description.trim() === '') {
        throw new Error('Product description is required');
    }
};

ProductValidator.validatePrice = (price) => {
    if (typeof price !== 'number' || price <= 0) {
        throw new Error('Product price must be a positive number');
    }
};

// ProductValidator.validateQuantity = (quantity) => {
//     if (typeof quantity !== 'number' || quantity < 0) {
//         throw new Error('Product quantity must be a non-negative number');
//     }
// };

ProductValidator.validateImage = (image) => {
    if (!image || image.trim() === '') {
        throw new Error('Product image is required!');
    }
}

ProductValidator.validateUpdateParams = (params) => {
    const { name, description, price, quantity, image } = params;

    ProductValidator.validatePrice(price);
    ProductValidator.validateDescription(description);
    ProductValidator.validateName(name);
    ProductValidator.validateImage(image);


}

module.exports = ProductValidator;

