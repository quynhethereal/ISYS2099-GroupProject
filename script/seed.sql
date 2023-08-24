DROP database IF EXISTS `lazada_ecommerce`;

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
    `image` VARCHAR(255) NOT NULL CHECK (TRIM(image) <> ''),
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


-- Drop role 
DROP ROLE IF EXISTS 'admin', 'customer', 'seller';
-- Create roles
CREATE ROLE IF NOT EXISTS 'admin', 'customer', 'seller';

-- Grant permissions for each user role
-- Admin: All rights
GRANT ALL PRIVILEGES ON lazada_ecommerce.* TO 'admin';

-- Customer: SELECT product, CRU users_info, orders, order_items and inventory
GRANT SELECT ON lazada_ecommerce.products TO 'customer';
GRANT INSERT, SELECT, UPDATE ON lazada_ecommerce.users_info TO 'customer';
GRANT INSERT, SELECT, UPDATE ON lazada_ecommerce.orders TO 'customer';
GRANT INSERT, SELECT, UPDATE, DELETE ON lazada_ecommerce.order_items TO 'customer';
GRANT SELECT ON lazada_ecommerce.inventory TO 'customer';

-- Seller: CRUD product, CRU users_info, orders and inventory
GRANT INSERT, SELECT, UPDATE, DELETE ON lazada_ecommerce.products TO 'seller';
GRANT INSERT, SELECT, UPDATE ON lazada_ecommerce.users_info TO 'seller';
GRANT SELECT, UPDATE ON lazada_ecommerce.orders TO 'seller';
GRANT SELECT ON lazada_ecommerce.inventory TO 'seller';

-- Create users with roles
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'Ladmin';
CREATE USER IF NOT EXISTS 'customer'@'localhost' IDENTIFIED BY 'Lcustomer';
CREATE USER IF NOT EXISTS 'seller'@'localhost' IDENTIFIED BY 'Lseller';

-- Assign roles to users
GRANT 'admin' TO 'admin'@'localhost';
GRANT 'customer' TO 'customer'@'localhost';
GRANT 'seller' TO 'seller'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Insert dummy data for users and users_info
INSERT INTO `users` (`username`, `hashed_password`, `salt_value`)
VALUES 
	('admin', '41daf57a257f11d162b77bdf358a354325271bc44c7890ac324909a6e0c4125480339717f25dbf6d57dfaf94a1bfbdf9361bf46a13813bb07759b83e9dcee36e', '123456');

INSERT INTO `users` (`username`, `hashed_password`, `salt_value`)
VALUES 
	('seller', '41daf57a257f11d162b77bdf358a354325271bc44c7890ac324909a6e0c4125480339717f25dbf6d57dfaf94a1bfbdf9361bf46a13813bb07759b83e9dcee36e', '123456');

INSERT INTO `users` (`username`, `hashed_password`, `salt_value`)
VALUES 
	('customer', '41daf57a257f11d162b77bdf358a354325271bc44c7890ac324909a6e0c4125480339717f25dbf6d57dfaf94a1bfbdf9361bf46a13813bb07759b83e9dcee36e', '123456');


INSERT INTO `users_info` (`user_id`, `first_name`, `last_name`, `role`, `email`, `phone`)
VALUES 
	(1, 'Admin', 'User', 'admin', 'admin@gmail.com', '0123456789');

INSERT INTO `users_info` (`user_id`, `first_name`, `last_name`, `role`, `email`, `phone`)
VALUES 
	(2, 'Seller', 'User', 'seller', 'seller@gmail.com', '0123452328');

INSERT INTO `users_info` (`user_id`, `first_name`, `last_name`, `role`, `email`, `phone`)
VALUES 
	(3, 'Customer', 'User', 'customer', 'customer@gmail.com', '0123456711');

-- Insert 30 dummy data for products
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
    ('Smart Home Hub', 'Control your home devices with a smart hub.', 79.00, 'home_hub_image_data', 'home_hub.jpg', 4.0, 4.0, 0.8, 3, NOW(), NOW()),
      ('Modern Dining Table', 'Gather around this elegant dining table for family meals and gatherings.', 699.00, 'dining_table_image_data', 'dining_table.jpg', 72.0, 36.0, 30.0, 5, NOW(), NOW()),
    ('Comfortable Recliner', 'Relax in style with this plush and comfortable recliner chair.', 349.99, 'recliner_image_data', 'recliner.jpg', 36.0, 32.0, 40.0, 5, NOW(), NOW()),
    ('Classic Wooden Bookshelf', 'Display your book collection with this timeless wooden bookshelf.', 249.95, 'bookshelf_image_data', 'bookshelf.jpg', 48.0, 12.0, 72.0, 5, NOW(), NOW()),
    ('Sleek TV Stand', 'Elevate your entertainment setup with this modern TV stand.', 199.50, 'tv_stand_image_data', 'tv_stand.jpg', 60.0, 18.0, 20.0, 5, NOW(), NOW()),
    ('Cozy Sectional Sofa', 'Create a cozy seating area with this spacious sectional sofa.', 899.00, 'sectional_sofa_image_data', 'sectional_sofa.jpg', 108.0, 84.0, 36.0, 5, NOW(), NOW()),
    ('Stylish Coffee Table', 'Complete your living room with this stylish and functional coffee table.', 149.99, 'coffee_table_image_data', 'coffee_table.jpg', 48.0, 24.0, 18.0, 5, NOW(), NOW()),
    ('King Size Bed Frame', 'Sleep in luxury with this elegant king size bed frame.', 799.99, 'bed_frame_image_data', 'bed_frame.jpg', 80.0, 76.0, 12.0, 5, NOW(), NOW()),
    ('Vintage Armchair', 'Add a touch of vintage charm to your space with this classic armchair.', 199.00, 'armchair_image_data', 'armchair.jpg', 30.0, 30.0, 40.0, 5, NOW(), NOW()),
    ('Study Desk', 'Create an inspiring workspace with this functional study desk.', 129.95, 'study_desk_image_data', 'study_desk.jpg', 48.0, 24.0, 30.0, 5, NOW(), NOW()),
    ('Outdoor Patio Set', 'Enjoy outdoor relaxation with this stylish patio furniture set.', 599.00, 'patio_set_image_data', 'patio_set.jpg', 72.0, 36.0, 30.0, 5, NOW(), NOW());

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
	(10, 5, 110, 0, NOW() - INTERVAL 9 HOUR, NOW() - INTERVAL 9 HOUR),
    (11, 1, 60, 0, NOW() - INTERVAL 10 HOUR, NOW() - INTERVAL 10 HOUR),
    (12, 2, 25, 0, NOW() - INTERVAL 11 HOUR, NOW() - INTERVAL 11 HOUR),
    (13, 3, 180, 0, NOW() - INTERVAL 12 HOUR, NOW() - INTERVAL 12 HOUR),
    (14, 4, 50, 0, NOW() - INTERVAL 13 HOUR, NOW() - INTERVAL 13 HOUR),
    (15, 5, 85, 0, NOW() - INTERVAL 14 HOUR, NOW() - INTERVAL 14 HOUR),
    (16, 1, 40, 0, NOW() - INTERVAL 15 HOUR, NOW() - INTERVAL 15 HOUR),
    (17, 2, 95, 0, NOW() - INTERVAL 16 HOUR, NOW() - INTERVAL 16 HOUR),
    (18, 3, 120, 0, NOW() - INTERVAL 17 HOUR, NOW() - INTERVAL 17 HOUR),
    (19, 4, 70, 0, NOW() - INTERVAL 18 HOUR, NOW() - INTERVAL 18 HOUR),
    (20, 5, 105, 0, NOW() - INTERVAL 19 HOUR, NOW() - INTERVAL 19 HOUR);
