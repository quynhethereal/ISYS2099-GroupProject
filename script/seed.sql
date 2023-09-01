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
-- Indexing
ALTER TABLE users
	ADD INDEX idx_users_username(username);


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
-- Indexing
ALTER TABLE users_info
	ADD INDEX idx_users_info_user_id(user_id);

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
    `seller_id` INT(11) NOT NULL,
    `category_id` INT(11) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- Indexing
ALTER TABLE products
    ADD FULLTEXT INDEX idx_products_title_description(title, description),
	ADD INDEX idx_products_price(price),
    ADD INDEX idx_products_seller_id(seller_id),
	ADD INDEX idx_products_category_id(category_id);

-- add foreign keys
ALTER TABLE `products` ADD FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`);


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

-- Bandaid trigger to prevent duplicate inventory that has the same product_id and warehouse_id
DELIMITER //

CREATE TRIGGER prevent_duplicate_inventory
BEFORE INSERT ON inventory
FOR EACH ROW
BEGIN
    DECLARE duplicate_count INT;

    SELECT COUNT(*) INTO duplicate_count
    FROM inventory
    WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id;

    IF duplicate_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Duplicate entry for product_id and warehouse_id';
    END IF;
END;
//

DELIMITER ;

-- Indexing
ALTER TABLE inventory
	ADD INDEX idx_inventory_product_id_quantity(product_id, quantity),
	ADD INDEX idx_inventory_product_id_warehouse_id(product_id, warehouse_id);

-- Add foreign keys
ALTER TABLE `inventory` ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;
ALTER TABLE `inventory` ADD FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`);

-- Triggers to create ULID for inventory on insert
-- SET GLOBAL log_bin_trust_function_creators = 1; // run this if you have error
DROP trigger IF EXISTS before_inventory_insert;
DELIMITER //
CREATE TRIGGER before_inventory_insert
BEFORE INSERT ON inventory
FOR EACH ROW
BEGIN
    SET NEW.id = ULID_FROM_DATETIME(NEW.created_at);
END;
//
DELIMITER ;

CREATE TABLE `pending_inventory` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Add foreign keys
ALTER TABLE `pending_inventory` ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;


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
-- Indexing
ALTER TABLE orders
	ADD INDEX idx_orders_user_id_status(user_id, status),
	ADD INDEX idx_orders_id_user_id(id, user_id),
	ADD INDEX idx_orders_id_user_id_status(id, user_id, status),
	ADD INDEX idx_orders_id(id),
	ADD INDEX idx_orders_status(status);

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
-- Indexing
ALTER TABLE order_items 
	ADD INDEX idx_order_items_order_id(order_id),
	ADD INDEX idx_order_items_inventory_id(inventory_id),
	ADD INDEX idx_order_items_inventory_id_order_id(inventory_id, order_id);

-- Add foreign keys
ALTER TABLE `order_items` ADD FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`);
ALTER TABLE `order_items` ADD FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`);


-- Drop all roles and users if exists
drop role if exists 'admin', 'customer', 'seller', 'wh_admin';
drop user if exists 'admin'@'localhost', 'customer'@'localhost', 'seller'@'localhost', 'wh_admin'@'localhost';

-- Create role
create role 'admin', 'customer', 'seller', 'wh_admin';

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
GRANT SELECT ON lazada_ecommerce.order_items TO 'seller';

-- Create users with roles
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'Ladmin';
CREATE USER IF NOT EXISTS 'customer'@'localhost' IDENTIFIED BY 'Lcustomer';
CREATE USER IF NOT EXISTS 'seller'@'localhost' IDENTIFIED BY 'Lseller';
CREATE USER IF NOT EXISTS 'wh_admin'@'localhost' IDENTIFIED BY 'Lwhadmin';

-- Warehouse admin: All privilege related to warehouse and inventory, select and update products (if needed)
grant insert, select, update on lazada_ecommerce.users_info to 'wh_admin';
grant insert, select, update on lazada_ecommerce.users to 'wh_admin';
grant all privileges on lazada_ecommerce.inventory to 'wh_admin';
grant all privileges on lazada_ecommerce.warehouses to 'wh_admin';
grant select, update on lazada_ecommerce.products to 'wh_admin';
grant insert, select, update, delete on lazada_ecommerce.pending_inventory to 'wh_admin';
grant execute on procedure lazada_ecommerce.ASSIGN_INVENTORY_TO_WAREHOUSE to 'wh_admin';
grant execute on procedure lazada_ecommerce.UPDATE_INVENTORY_ON_ORDER_ACCEPT to 'wh_admin';
grant execute on procedure lazada_ecommerce.UPDATE_INVENTORY_ON_ORDER_REJECT to 'wh_admin';
GRANT INSERT, SELECT, UPDATE, DELETE ON lazada_ecommerce.orders TO 'wh_admin';
GRANT INSERT, SELECT, UPDATE, DELETE ON lazada_ecommerce.order_items TO 'wh_admin';

-- Assign roles to users
GRANT 'admin' TO 'admin'@'localhost';
GRANT 'customer' TO 'customer'@'localhost';
GRANT 'seller' TO 'seller'@'localhost';
GRANT 'wh_admin' TO 'wh_admin'@'localhost';

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
INSERT INTO `products` (`title`, `description`, `price`, `image`, `image_name`, `length`, `width`, `height`, `category_id`, `seller_id`, `created_at`, `updated_at`)
VALUES
    ('Smartphone X', 'High-end smartphone with advanced features.', 799.99, 'https://technostore.es/wp-content/uploads/smartphone_x_series_1.jpeg', 'smartphone_x.jpg', 5.7, 2.8, 0.35, 1, 2, NOW(), NOW()),
    ('Laptop Pro', 'Powerful laptop for professionals and creators.', 1499.99, 'https://cdn.tgdd.vn/Products/Images/44/282885/apple-macbook-pro-m2-2022-xam-600x600.jpg', 'laptop_pro.jpg', 14.0, 9.5, 0.75, 2, 2, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR),
    ('Fitness Tracker', 'Track your fitness activities and stay healthy.', 49.95, 'https://media.wired.com/photos/61b26233c2f5f4d2aaf1c2b5/master/w_2580,c_limit/Gear-Fitbit-Charge-5.jpg', 'fitness_tracker.jpg', 1.5, 1.2, 0.2, 3, 2, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR),
    ('Wireless Earbuds', 'Enjoy high-quality sound without the wires.', 89.99, 'https://cdn-amz.woka.io/images/I/61ERSWgDaOL.jpg', 'earbuds.jpg', 2.0, 1.5, 0.5, 1, 2, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 3 HOUR),
    ('Coffee Maker', 'Brew your favorite coffee with ease.', 39.99, 'https://www.realsimple.com/thmb/hSXYZv75NB9gny3R1Kn0YtxTw4Y=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/best-coffee-makers-with-grinders-test-tout-a5f577a81be746489d952770f8181c12.jpg', 'coffee_maker.jpg', 9.0, 6.0, 8.0, 4, 2, NOW() - INTERVAL 4 HOUR, NOW() - INTERVAL 4 HOUR),
    ('Gaming Console', 'Experience immersive gaming adventures.', 299.00, 'https://hips.hearstapps.com/hmg-prod/images/gh-index-gamingconsoles-052-print-preview-1659705142.jpg', 'gaming_console.jpg', 12.0, 8.0, 2.5, 2, 2, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 5 HOUR),
    ('Portable Speaker', 'Take your music anywhere with this portable speaker.', 59.95, 'https://cdn-amz.woka.io/images/I/91Dx8-EPbAL.jpg', 'speaker.jpg', 4.5, 3.5, 1.0, 1, 2, NOW() - INTERVAL 6 HOUR, NOW() - INTERVAL 6 HOUR),
    ('Smart Watch', 'Stay connected and track your health on the go.', 199.50, 'https://m.media-amazon.com/images/I/71JU-bUt-sL._AC_UF1000,1000_QL80_.jpg', 'smart_watch.jpg', 1.8, 1.5, 0.4, 3, 2, NOW() - INTERVAL 7 HOUR, NOW() - INTERVAL 7 HOUR),
    ('Digital Camera', 'Capture stunning photos and memories.', 499.99, 'https://cdn-amz.woka.io/images/I/71JDnICC3nL.jpg', 'camera.jpg', 5.2, 3.8, 2.2, 2, 2, NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 8 HOUR),
    ('Blender', 'Blend your favorite fruits into delicious smoothies.', 79.00, 'https://m.media-amazon.com/images/I/61OVQA0Bu3L.jpg', 'blender.jpg', 8.0, 6.5, 10.0, 4, 2, NOW() - INTERVAL 9 HOUR, NOW() - INTERVAL 9 HOUR),
    ('Fitness Treadmill', 'Stay fit with this advanced treadmill.', 1299.00, 'https://www.liberty.edu/campusrec/wp-content/uploads/sites/191/2021/07/Nikki-e1627310081772.jpg', 'treadmill.jpg', 6.5, 3.0, 4.5, 3, 2, NOW() - INTERVAL 10 HOUR, NOW() - INTERVAL 10 HOUR),
    ('Wireless Mouse', 'Enhance your productivity with a wireless mouse.', 29.99, 'https://www.nnkk.vn/media/product/1489_logitech_wireless_mouse_m1852.jpg', 'mouse.jpg', 4.0, 2.5, 1.0, 2, 2, NOW() - INTERVAL 11 HOUR, NOW() - INTERVAL 11 HOUR),
    ('LED TV', 'Enjoy your favorite shows and movies in high definition.', 599.95, 'https://m.media-amazon.com/images/I/71jU54Q6ChL.jpg', 'tv.jpg', 40.0, 25.0, 4.0, 1, 1, NOW() - INTERVAL 12 HOUR, NOW() - INTERVAL 12 HOUR),
    ('Cookware Set', 'Upgrade your kitchen with this comprehensive cookware set.', 149.95, 'https://cdn-amz.woka.io/images/I/81lor0Hbx6L.jpg', 'cookware.jpg', 14.0, 10.0, 6.0, 4, 2, NOW() - INTERVAL 13 HOUR, NOW() - INTERVAL 13 HOUR),
    ('Wireless Headphones', 'Immerse yourself in music with wireless headphones.', 119.99, 'https://cdn-amz.woka.io/images/I/61-g7m+90eL.jpg', 'headphones.jpg', 3.0, 2.5, 1.5, 1, 2, NOW() - INTERVAL 14 HOUR, NOW() - INTERVAL 14 HOUR),
    ('Home Security Camera', 'Monitor your home with a smart security camera.', 89.50, 'https://cdn-amz.woka.io/images/I/71Bj7KemwsS.jpg', 'security_camera.jpg', 3.5, 2.0, 2.0, 3, 2, NOW() - INTERVAL 15 HOUR, NOW() - INTERVAL 15 HOUR),
    ('Vacuum Cleaner', 'Efficiently clean your home with a powerful vacuum.', 169.00, 'https://www.realsimple.com/thmb/l5RJq3jSYpM3t8rDqrApzMfAoLM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/rsp-detail-tineco-pure-one-s11-tango-smart-stick-handheld-vacuum-at-tineco-hwortock-0015-8885297ca9724189a2124fd3ca15225a.jpg', 'vacuum.jpg', 12.0, 9.0, 3.0, 2, 2, NOW() - INTERVAL 16 HOUR, NOW() - INTERVAL 16 HOUR),
    ('Tablet Computer', 'Versatile tablet for work and entertainment.', 249.99, 'https://m.media-amazon.com/images/I/71eZj-iWIrL.jpg', 'tablet.jpg', 9.5, 7.0, 0.4, 1, 2, NOW() - INTERVAL 17 HOUR, NOW() - INTERVAL 17 HOUR),
    ('Indoor Plants Set', 'Bring nature indoors with a set of beautiful plants.', 49.95, 'https://perfectplantdeal.nl/wp-content/uploads/2019/11/Indoor-Plant-Mix.jpg', 'plants.jpg', 1.0, 1.0, 1.0, 4, 2, NOW() - INTERVAL 18 HOUR, NOW() - INTERVAL 18 HOUR),
    ('Smart Home Hub', 'Control your home devices with a smart hub.', 79.00, 'https://www.thespruce.com/thmb/7W3eC1zSwlQSgYrhrvEOtBwruJk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SPR-Home-best-smart-home-hubs-5271295-v1-b34ced76be47480daf88ec5b9d3660e3.jpg', 'home_hub.jpg', 4.0, 4.0, 0.8, 3, 2,  NOW() - INTERVAL 19 HOUR, NOW() - INTERVAL 19 HOUR),
    ('Modern Dining Table', 'Gather around this elegant dining table for family meals and gatherings.', 699.00, 'https://images.thdstatic.com/productImages/af4d5966-2d3b-44bc-aff1-1df2b37afdc4/svn/white-71-kitchen-dining-tables-monmucf-05-64_1000.jpg', 'dining_table.jpg', 72.0, 36.0, 30.0, 5, 2, NOW() - INTERVAL 20 HOUR, NOW() - INTERVAL 20 HOUR),
    ('Comfortable Recliner', 'Relax in style with this plush and comfortable recliner chair.', 349.99, 'https://m.media-amazon.com/images/I/81QFISqxKRL._AC_UF894,1000_QL80_.jpg', 'recliner.jpg', 36.0, 32.0, 40.0, 5,2, NOW() - INTERVAL 21 HOUR, NOW() - INTERVAL 21 HOUR),
    ('Classic Wooden Bookshelf', 'Display your book collection with this timeless wooden bookshelf.', 249.95, 'https://4.imimg.com/data4/TD/SX/MY-1804991/classic-bookcase.jpeg', 'bookshelf.jpg', 48.0, 12.0, 72.0, 5, 2, NOW() - INTERVAL 22 HOUR, NOW() - INTERVAL 22 HOUR),
    ('Sleek TV Stand', 'Elevate your entertainment setup with this modern TV stand.', 199.50, 'https://www.yankodesign.com/images/design_news/2022/01/award-winning-minimal-tv-stand-uses-an-easel-style-design-to-prop-your-tv-up-in-sleek-fashion/eva_solo_carry_minimalist_tv_stand_1.jpg', 'tv_stand.jpg', 60.0, 18.0, 20.0, 5, 2, NOW() - INTERVAL 23 HOUR, NOW() - INTERVAL 23 HOUR),
    ('Cozy Sectional Sofa', 'Create a cozy seating area with this spacious sectional sofa.', 899.00, 'https://global-uploads.webflow.com/5e93308b2af0f955a9a2e796/63bc0122f541cb782fbca58d_Kova.jpg', 'sectional_sofa.jpg', 108.0, 84.0, 36.0, 5, 2, NOW() - INTERVAL 24 HOUR, NOW() - INTERVAL 24 HOUR),
    ('Stylish Coffee Table', 'Complete your living room with this stylish and functional coffee table.', 149.99, 'https://www.juliettesinteriors.co.uk/wp-content/uploads/2022/07/modern-square-coffee-table-with-glass-top-1.jpg', 'coffee_table.jpg', 48.0, 24.0, 18.0, 5, 2, NOW() - INTERVAL 25 HOUR, NOW() - INTERVAL 25 HOUR),
    ('King Size Bed Frame', 'Sleep in luxury with this elegant king size bed frame.', 799.99, 'https://cdn-amz.woka.io/images/I/71s9nKG58QL.jpg', 'bed_frame.jpg', 80.0, 76.0, 12.0, 5, 2, NOW() - INTERVAL 26 HOUR, NOW() - INTERVAL 26 HOUR),
    ('Vintage Armchair', 'Add a touch of vintage charm to your space with this classic armchair.', 199.00, 'https://www.mbu.edu/props/wp-content/uploads/sites/25/2022/07/20220617_081934-scaled.jpg', 'armchair.jpg', 30.0, 30.0, 40.0, 5, 2, NOW() - INTERVAL 27 HOUR, NOW() - INTERVAL 27 HOUR),
    ('Study Desk', 'Create an inspiring workspace with this functional study desk.', 129.95, 'https://ae01.alicdn.com/kf/Hbb873be6975743c7bca9c91866240cf4V/Computer-desk-study-table-Nordic-office-desk-Modern-Europe-student-bedroom-study-desk-office-furniture-small.jpg', 'study_desk.jpg', 48.0, 24.0, 30.0, 5, 2, NOW() - INTERVAL 28 HOUR, NOW() - INTERVAL 28 HOUR),
    ('Outdoor Patio Set', 'Enjoy outdoor relaxation with this stylish patio furniture set.', 599.00, 'https://cdn-amz.woka.io/images/I/91aBcqhssOL.jpg', 'patio_set.jpg', 72.0, 36.0, 30.0, 5, 2, NOW() - INTERVAL 29 HOUR, NOW() - INTERVAL 29 HOUR);

    
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
