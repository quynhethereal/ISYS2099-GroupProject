CREATE DATABASE IF NOT EXISTS `lazada_ecommerce`;

-- Create role
CREATE ROLE 'admin', 'customer', 'seller';

-- Grant permission for each user role
-- Admin: All rights
GRANT ALL PRIVILEGES ON lazada_ecommerce.* TO 'seller';

-- Customer: SELECT product, CRUD order, CRU customer (for their specific account)
GRANT SELECT ON lazada_ecommerce.product TO 'customer';
GRANT INSERT, SELECT, UPDATE, DELETE ON lazada_ecommerce.order TO 'customer';
GRANT INSERT, SELECT, UPDATE ON lazada_ecommerce.product TO 'customer';

-- Seller: CRUD product, CRUD order, CRUD seller (for their specific account)
GRANT INSERT, SELECT, UPDATE, DELETE ON lazada_ecommerce.product TO 'seller';
GRANT INSERT, SELECT, UPDATE, DELETE ON lazada_ecommerce.order TO 'customer';
GRANT INSERT, SELECT, UPDATE ON lazada_ecommerce.seller TO 'seller';

-- Create user
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'Ladmin';
CREATE USER 'customer'@'localhost' IDENTIFIED BY 'Lcustomer';
CREATE USER 'seller'@'localhost' IDENTIFIED BY 'Lseller';

-- Set role to user
GRANT 'admin' TO 'admin'@'localhost';
GRANT 'customer' TO 'customer'@'localhost';
GRANT 'seller' TO 'seller'@'localhost';

USE `lazada_ecommerce`;

-- Path: script/seed.sql
CREATE TABLE IF NOT EXISTS `users`(
`id` int(11) NOT NULL AUTO_INCREMENT,
`username` varchar(255) NOT NULL,
`hashed_password` varchar(255) NOT NULL,
`salt_value` varchar(255) NOT NULL,
`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users_info`(
`id` int(11) NOT NULL AUTO_INCREMENT,
`user_id` int(11) NOT NULL,
`first_name` varchar(255) NOT NULL,
`last_name` varchar(255) NOT NULL,
`email` varchar(255) NOT NULL,
`phone` varchar(255) NOT NULL,
`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` DECIMAL(10, 2),
  `image` varchar(255) NOT NULL,
  `length` DECIMAL(10, 2),
  `width` DECIMAL(10, 2),
  `height` DECIMAL(10, 2),
  `category_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `warehouses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `area` DECIMAL(10, 2),
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `product`(`id`),
  FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse`(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- Insert dummy data
-- Dummy user has password "password" by default
INSERT INTO `users` (`username`, `hashed_password`, `salt_value`) VALUES ('admin', '41daf57a257f11d162b77bdf358a354325271bc44c7890ac324909a6e0c4125480339717f25dbf6d57dfaf94a1bfbdf9361bf46a13813bb07759b83e9dcee36e', '123456');
INSERT INTO `users_info` (`user_id`, `first_name`, `last_name`, `email`, `phone`) VALUES (1, 'Admin', 'User', 'admin@gmail.com', '0123456789');

-- Dummy products
INSERT INTO `products` (`title`, `description`, `price`, `image`, `length`, `width`, `height`, `category_id`) VALUES
('Smartphone Model X', 'Experience the latest technology with our powerful smartphone.', 699.99, 'smartphone_model_x.jpg', 15.0, 7.5, 0.8, 1),
('Ultra HD Smart TV', 'Immerse yourself in stunning visuals with our Ultra HD smart TV.', 999.99, 'ultra_hd_tv.jpg', 45.6, 25.8, 5.3, 2),
('Gaming Laptop Pro', 'Unleash your gaming potential with our high-performance gaming laptop.', 1499.99, 'gaming_laptop_pro.jpg', 14.7, 10.2, 1.1, 3),
('Wireless Noise-Cancelling Headphones', 'Enjoy your favorite music with crystal-clear sound and noise cancellation.', 249.99, 'wireless_headphones.jpg', 7.8, 6.4, 3.2, 4),
('Home Security Camera System', 'Keep your home safe and secure with our advanced camera system.', 349.99, 'security_camera_system.jpg', 8.5, 8.5, 6.0, 5),
('Stylish Smartwatch', 'Stay connected and track your fitness goals with our sleek smartwatch.', 199.99, 'stylish_smartwatch.jpg', 9.2, 7.0, 1.5, 1),
('Professional DSLR Camera', 'Capture life''s moments in stunning detail with our professional DSLR camera.', 1299.99, 'professional_dslr_camera.jpg', 14.0, 9.7, 6.2, 2),
('Portable Bluetooth Speaker', 'Take your music anywhere with our compact and powerful Bluetooth speaker.', 79.99, 'bluetooth_speaker.jpg', 6.5, 6.5, 4.0, 3),
('Fitness Tracker Band', 'Monitor your health and stay active with our comfortable fitness tracker.', 49.99, 'fitness_tracker_band.jpg', 7.0, 0.9, 0.4, 4),
('Home Espresso Machine', 'Brew cafe-quality espresso at home with our easy-to-use espresso machine.', 399.99, 'home_espresso_machine.jpg', 11.3, 9.8, 14.5, 5);


