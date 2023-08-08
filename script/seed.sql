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

CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `warehouse` (
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