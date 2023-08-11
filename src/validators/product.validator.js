// create TABLE IF NOT EXISTS `products` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `title` varchar(255) NOT NULL,
//   `description` varchar(255) NOT NULL,
//   `price` DECIMAL(10, 2),
//   `image` LONGBLOB,
//   `image_name` varchar(255),
//   `length` DECIMAL(10, 2),
//   `width` DECIMAL(10, 2),
//   `height` DECIMAL(10, 2),
//   `category_id` int(11) NOT NULL,
//   `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

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

