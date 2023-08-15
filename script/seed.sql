-- Create the database if not exists
CREATE DATABASE IF NOT EXISTS `lazada_ecommerce`;

-- Use the created database
USE `lazada_ecommerce`;

-- Path: script/seed.sql

-- Create `users` table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(TRIM(username)) BETWEEN 3 AND 20),
    `hashed_password` VARCHAR(255) NOT NULL,
    `salt_value` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- Create `users_info` table
CREATE TABLE IF NOT EXISTS `users_info` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL CHECK (first_name REGEXP '^[A-Za-z]+$'),
    `last_name` VARCHAR(255) NOT NULL CHECK (last_name REGEXP '^[A-Za-z]+$'),
    `role` VARCHAR(255) NOT NULL CHECK (role IN ('customer', 'seller', 'admin')),
    `email` VARCHAR(255) NOT NULL CHECK (email REGEXP '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    `phone` VARCHAR(255) NOT NULL CHECK (phone REGEXP '^[0-9]{10}$'),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- Create `products` table
CREATE TABLE IF NOT EXISTS `products` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL CHECK (TRIM(title) <> ''),
    `description` VARCHAR(255) NOT NULL CHECK (TRIM(description) <> ''),
    `price` DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    `image` LONGBLOB NOT NULL CHECK (TRIM(image) <> ''),
    `image_name` VARCHAR(255) NOT NULL CHECK (TRIM(image_name) <> ''),
    `length` DECIMAL(10, 2) NOT NULL CHECK (length >= 0),
    `width` DECIMAL(10, 2) NOT NULL CHECK (width >= 0),
    `height` DECIMAL(10, 2) NOT NULL CHECK (height >= 0),
    `category_id` INT(11) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- Create `warehouses` table
CREATE TABLE IF NOT EXISTS `warehouses` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL CHECK (TRIM(name) <> ''),
    `province` VARCHAR(255) NOT NULL CHECK (TRIM(province) <> ''),
    `city` VARCHAR(255) NOT NULL CHECK (TRIM(city) <> ''),
    `district` VARCHAR(255) NOT NULL CHECK (TRIM(district) <> ''),
    `street` VARCHAR(255) NOT NULL CHECK (TRIM(street) <> ''),
    `number` VARCHAR(20) NOT NULL CHECK (TRIM(number) <> ''),
    `total_volume` DECIMAL(10, 2) NOT NULL CHECK (total_volume > 0),
    `available_volume` DECIMAL(10, 2) NOT NULL CHECK (available_volume >= 0),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- Create `inventory` table
CREATE TABLE IF NOT EXISTS `inventory` (
    `product_id` INT(11) NOT NULL,
    `warehouse_id` INT(11) NOT NULL,
    `quantity` INT(11) NOT NULL CHECK (quantity >= 0),
    `reserved_quantity` INT(11) NOT NULL CHECK (reserved_quantity >= 0),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `id` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Add foreign keys
ALTER TABLE `inventory` ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`);
ALTER TABLE `inventory` ADD FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`);

-- Triggers to create ULID for inventory on insert
-- SET GLOBAL log_bin_trust_function_creators = 1; // run this if you have error
DELIMITER //
DROP trigger IF EXISTS before_inventory_insert;
CREATE TRIGGER before_inventory_insert
BEFORE INSERT ON inventory
FOR EACH ROW
BEGIN
  SET NEW.id = ULID_FROM_DATETIME(NEW.created_at);
END;
//
DELIMITER ;

-- Create `orders` table
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    `status` VARCHAR(255) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE `orders` ALTER `status` SET DEFAULT 'pending';
ALTER TABLE `orders` ALTER `total_price` SET DEFAULT 0.0;

-- Add foreign key
ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);

-- Create `order_items` table
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `order_id` INT(11) NOT NULL,
    `inventory_id` VARCHAR(255),
    `quantity` INT(11) NOT NULL CHECK (quantity >= 0),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- Add foreign keys
ALTER TABLE `order_items` ADD FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`);
ALTER TABLE `order_items` ADD FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`);

-- Create role
create role if not exists 'admin', 'customer', 'seller', 'wh_admin';

-- Create user
create user if not exists 'admin'@'localhost' identified by 'Ladmin';
create user if not exists 'customer'@'localhost' identified by 'Lcustomer';
create user if not exists 'seller'@'localhost' identified by 'Lseller';
create user if not exists 'wh_admin'@'localhost' identified by 'Lwhadmin';

-- Revoke all the privileges from all roles
revoke if exists ALL PRIVILEGES ON lazada_ecommerce.* FROM 'admin'@'localhost';
revoke if exists ALL PRIVILEGES ON lazada_ecommerce.* FROM 'customer'@'localhost';
revoke if exists ALL PRIVILEGES ON lazada_ecommerce.* FROM 'seller'@'localhost';
revoke if exists ALL PRIVILEGES ON lazada_ecommerce.* FROM 'wh_admin'@'localhost';

-- Grant permissions for each user role
-- Admin: All rights
GRANT ALL PRIVILEGES ON lazada_ecommerce.* TO 'admin';

-- Customer: SELECT product, CRU users_info, orders, order_items and inventory
grant select on lazada_ecommerce.products to 'customer';
grant insert, select, update on lazada_ecommerce.users_info to 'customer';
grant insert, select, update on lazada_ecommerce.orders to 'customer';
grant insert, select, update, delete on lazada_ecommerce.order_items to 'customer';
grant select on lazada_ecommerce.inventory to 'customer';
-- grant execute on procedure lazada_ecommerce.UPDATE_INVENTORY_ON_ORDER_ACCEPT to 'customer';

-- Seller: CRUD product, CRU users_info, orders and inventory
grant insert, select, update, delete on lazada_ecommerce.products to 'seller';
grant insert, select, update on lazada_ecommerce.users_info to 'seller';
grant select, update on lazada_ecommerce.orders to 'seller';
grant select on lazada_ecommerce.inventory to 'seller';

-- Warehouse admin: All privilege related to warehouse and inventory, select and update products (if needed)
grant all on lazada_ecommerce.inventory to 'wh_admin';
grant all on lazada_ecommerce.warehouses to 'wh_admin';
grant select, update on lazada_ecommerce.products to 'wh_admin';

-- Set role to user
grant 'admin' to 'admin'@'localhost';
grant 'customer' to 'customer'@'localhost';
grant 'seller' to 'seller'@'localhost';
grant 'wh_admin' to 'wh_admin'@'localhost';

flush privileges;

-- Insert dummy data for users and users_info
INSERT INTO `users` (`username`, `hashed_password`, `salt_value`)
VALUES 
	('admin', '41daf57a257f11d162b77bdf358a354325271bc44c7890ac324909a6e0c4125480339717f25dbf6d57dfaf94a1bfbdf9361bf46a13813bb07759b83e9dcee36e', '123456');

INSERT INTO `users_info` (`user_id`, `first_name`, `last_name`, `role`, `email`, `phone`)
VALUES 
	(1, 'Admin', 'User', 'admin', 'admin@gmail.com', '0123456789');

-- Insert 20 dummy data for products
-- Insert dummy data for products with image names
INSERT INTO `products` (`title`, `description`, `price`, `image`, `image_name`, `length`, `width`, `height`, `category_id`, `created_at`, `updated_at`)
VALUES
    ('Smartphone X', 'High-end smartphone with advanced features.', 799.99, 'smartphone_x_image_data', 'smartphone_x.jpg', 5.7, 2.8, 0.35, 1, NOW(), NOW()),
    ('Laptop Pro', 'Powerful laptop for professionals and creators.', 1499.99, 'laptop_pro_image_data', 'laptop_pro.jpg', 14.0, 9.5, 0.75, 2, NOW(), NOW()),
    ('Fitness Tracker', 'Track your fitness activities and stay healthy.', 49.95, 'fitness_tracker_image_data', 'fitness_tracker.jpg', 1.5, 1.2, 0.2, 3, NOW(), NOW()),
    ('Wireless Earbuds', 'Enjoy high-quality sound without the wires.', 89.99, 'earbuds_image_data', 'earbuds.jpg', 2.0, 1.5, 0.5, 1, NOW(), NOW()),
    ('Coffee Maker', 'Brew your favorite coffee with ease.', 39.99, 'coffee_maker_image_data', 'coffee_maker.jpg', 9.0, 6.0, 8.0, 4, NOW(), NOW()),
    ('Gaming Console', 'Experience immersive gaming adventures.', 299.00, 'gaming_console_image_data', 'gaming_console.jpg', 12.0, 8.0, 2.5, 2, NOW(), NOW()),
    ('Portable Speaker', 'Take your music anywhere with this portable speaker.', 59.95, 'speaker_image_data', 'speaker.jpg', 4.5, 3.5, 1.0, 1, NOW(), NOW()),
    ('Smart Watch', 'Stay connected and track your health on the go.', 199.50, 'smart_watch_image_data', 'smart_watch.jpg', 1.8, 1.5, 0.4, 3, NOW(), NOW()),
    ('Digital Camera', 'Capture stunning photos and memories.', 499.99, 'camera_image_data', 'camera.jpg', 5.2, 3.8, 2.2, 2, NOW(), NOW()),
    ('Blender', 'Blend your favorite fruits into delicious smoothies.', 79.00, 'blender_image_data', 'blender.jpg', 8.0, 6.5, 10.0, 4, NOW(), NOW()),
    ('Fitness Treadmill', 'Stay fit with this advanced treadmill.', 1299.00, 'treadmill_image_data', 'treadmill.jpg', 6.5, 3.0, 4.5, 3, NOW(), NOW()),
    ('Wireless Mouse', 'Enhance your productivity with a wireless mouse.', 29.99, 'mouse_image_data', 'mouse.jpg', 4.0, 2.5, 1.0, 2, NOW(), NOW()),
    ('LED TV', 'Enjoy your favorite shows and movies in high definition.', 599.95, 'tv_image_data', 'tv.jpg', 40.0, 25.0, 4.0, 1, NOW(), NOW()),
    ('Cookware Set', 'Upgrade your kitchen with this comprehensive cookware set.', 149.95, 'cookware_image_data', 'cookware.jpg', 14.0, 10.0, 6.0, 4, NOW(), NOW()),
    ('Wireless Headphones', 'Immerse yourself in music with wireless headphones.', 119.99, 'headphones_image_data', 'headphones.jpg', 3.0, 2.5, 1.5, 1, NOW(), NOW()),
    ('Home Security Camera', 'Monitor your home with a smart security camera.', 89.50, 'security_camera_image_data', 'security_camera.jpg', 3.5, 2.0, 2.0, 3, NOW(), NOW()),
    ('Vacuum Cleaner', 'Efficiently clean your home with a powerful vacuum.', 169.00, 'vacuum_image_data', 'vacuum.jpg', 12.0, 9.0, 3.0, 2, NOW(), NOW()),
    ('Tablet Computer', 'Versatile tablet for work and entertainment.', 249.99, 'tablet_image_data', 'tablet.jpg', 9.5, 7.0, 0.4, 1, NOW(), NOW()),
    ('Indoor Plants Set', 'Bring nature indoors with a set of beautiful plants.', 49.95, 'plants_image_data', 'plants.jpg', 1.0, 1.0, 1.0, 4, NOW(), NOW()),
    ('Smart Home Hub', 'Control your home devices with a smart hub.', 79.00, 'home_hub_image_data', 'home_hub.jpg', 4.0, 4.0, 0.8, 3, NOW(), NOW());

-- Insert 5 dummy records into the warehouses table
INSERT INTO `warehouses` (`name`, `province`, `city`, `district`, `street`, `number`, `total_volume`, `available_volume`)
VALUES
    ('Warehouse A', 'Province A', 'City A', 'District A', 'Street A', '123', 1000.00, 800.00),
    ('Warehouse B', 'Province B', 'City B', 'District B', 'Street B', '456', 1500.00, 1200.00),
    ('Warehouse C', 'Province C', 'City C', 'District C', 'Street C', '789', 2000.00, 1800.00),
    ('Warehouse D', 'Province D', 'City D', 'District D', 'Street D', '1011', 1200.00, 1000.00),
    ('Warehouse E', 'Province E', 'City E', 'District E', 'Street E', '1314', 1800.00, 1600.00);


-- Insert 10 dummy records into the inventory table
INSERT INTO `inventory` (`product_id`, `warehouse_id`, `quantity`, `reserved_quantity`, `created_at`, `updated_at`)
VALUES
	(1, 1, 100, 0, NOW(), NOW()),
	(2, 2, 50, 0, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR),
	(3, 3, 200, 0, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR),
	(4, 4, 75, 0, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 3 HOUR),
	(5, 5, 120, 0, NOW() - INTERVAL 4 HOUR, NOW() - INTERVAL 4 HOUR),
	(6, 1, 30, 0, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 5 HOUR),
	(7, 2, 80, 0, NOW() - INTERVAL 6 HOUR, NOW() - INTERVAL 6 HOUR),
	(8, 3, 150, 0, NOW() - INTERVAL 7 HOUR, NOW() - INTERVAL 7 HOUR),
	(9, 4, 90, 0, NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 8 HOUR),
	(10, 5, 110, 0, NOW() - INTERVAL 9 HOUR, NOW() - INTERVAL 9 HOUR);
