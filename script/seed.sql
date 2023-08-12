create DATABASE IF NOT EXISTS `lazada_ecommerce`;
USE `lazada_ecommerce`;

-- Path: script/seed.sql
create TABLE IF NOT EXISTS `users`(
`id` int(11) NOT NULL AUTO_INCREMENT,
`username` varchar(255) NOT NULL,
`hashed_password` varchar(255) NOT NULL,
`salt_value` varchar(255) NOT NULL,
`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create TABLE IF NOT EXISTS `users_info`(
`id` int(11) NOT NULL AUTO_INCREMENT,
`user_id` int(11) NOT NULL,
`first_name` varchar(255) NOT NULL,
`last_name` varchar(255) NOT NULL,
`role` varchar(255) NOT NULL,
`email` varchar(255) NOT NULL,
`phone` varchar(255) NOT NULL,
`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` DECIMAL(10, 2),
  `image` LONGBLOB,
  `image_name` varchar(255),
  `length` DECIMAL(10, 2),
  `width` DECIMAL(10, 2),
  `height` DECIMAL(10, 2),
  `category_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create TABLE IF NOT EXISTS `warehouses` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`address` varchar(255) NOT NULL,
`total_volume` DECIMAL(10, 2),
`available_volume` DECIMAL(10, 2),
`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create TABLE IF NOT EXISTS `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- add foreign keys
ALTER TABLE `inventory` ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`);
ALTER TABLE `inventory` ADD FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`);

-- Create role
create role if not exists 'admin', 'customer', 'seller';

-- Grant permission for each user role
-- Admin: All rights
grant all privileges on lazada_ecommerce.* TO 'admin';

-- Customer: SELECT product, CRU user (its account)
grant select on lazada_ecommerce.products to 'customer';
grant insert, select, update on lazada_ecommerce.users_info to 'customer';

-- Seller: CRUD product, CRU user (its account)
grant insert, select, update, delete on lazada_ecommerce.products to 'seller';
grant insert, select, update on lazada_ecommerce.users_info to 'seller';

-- Create user
create user if not exists 'admin'@'localhost' identified by 'Ladmin';
create user if not exists 'customer'@'localhost' identified by 'Lcustomer';
create user if not exists 'seller'@'localhost' identified by 'Lseller';

-- Set role to user
grant 'admin' to 'admin'@'localhost';
grant 'customer' to 'customer'@'localhost';
grant 'seller' to 'seller'@'localhost';

-- Insert dummy data
-- Dummy user has password "password" by default
insert into `users` (`username`, `hashed_password`, `salt_value`) VALUES ('admin', '41daf57a257f11d162b77bdf358a354325271bc44c7890ac324909a6e0c4125480339717f25dbf6d57dfaf94a1bfbdf9361bf46a13813bb07759b83e9dcee36e', '123456');
insert into `users_info` (`user_id`, `first_name`, `last_name`, `role`, `email`, `phone`) VALUES (1, 'Admin', 'User', 'admin', 'admin@gmail.com', '0123456789');

-- Dummy products
-- Insert 20 dummy records into the products table
INSERT INTO `products` (`title`, `description`, `price`, `image`, `image_name`, `length`, `width`, `height`, `category_id`, `created_at`, `updated_at`)
VALUES
  ('Smartphone X', 'High-end smartphone with advanced features.', 799.99, NULL, 'smartphone_x.jpg', 5.7, 2.8, 0.35, 1, NOW(), NOW()),
  ('Laptop Pro', 'Powerful laptop for professionals and creators.', 1499.99, NULL, 'laptop_pro.jpg', 14.0, 9.5, 0.75, 2, NOW(), NOW()),
  ('Fitness Tracker', 'Track your fitness activities and stay healthy.', 49.95, NULL, 'fitness_tracker.jpg', 1.5, 1.2, 0.2, 3, NOW(), NOW()),
  ('Wireless Earbuds', 'Enjoy high-quality sound without the wires.', 89.99, NULL, 'earbuds.jpg', 2.0, 1.5, 0.5, 1, NOW(), NOW()),
  ('Coffee Maker', 'Brew your favorite coffee with ease.', 39.99, NULL, 'coffee_maker.jpg', 9.0, 6.0, 8.0, 4, NOW(), NOW()),
  ('Gaming Console', 'Experience immersive gaming adventures.', 299.00, NULL, 'gaming_console.jpg', 12.0, 8.0, 2.5, 2, NOW(), NOW()),
  ('Portable Speaker', 'Take your music anywhere with this portable speaker.', 59.95, NULL, 'speaker.jpg', 4.5, 3.5, 1.0, 1, NOW(), NOW()),
  ('Smart Watch', 'Stay connected and track your health on the go.', 199.50, NULL, 'smart_watch.jpg', 1.8, 1.5, 0.4, 3, NOW(), NOW()),
  ('Digital Camera', 'Capture stunning photos and memories.', 499.99, NULL, 'camera.jpg', 5.2, 3.8, 2.2, 2, NOW(), NOW()),
  ('Blender', 'Blend your favorite fruits into delicious smoothies.', 79.00, NULL, 'blender.jpg', 8.0, 6.5, 10.0, 4, NOW(), NOW()),
  ('Fitness Treadmill', 'Stay fit with this advanced treadmill.', 1299.00, NULL, 'treadmill.jpg', 6.5, 3.0, 4.5, 3, NOW(), NOW()),
  ('Wireless Mouse', 'Enhance your productivity with a wireless mouse.', 29.99, NULL, 'mouse.jpg', 4.0, 2.5, 1.0, 2, NOW(), NOW()),
  ('LED TV', 'Enjoy your favorite shows and movies in high definition.', 599.95, NULL, 'tv.jpg', 40.0, 25.0, 4.0, 1, NOW(), NOW()),
  ('Cookware Set', 'Upgrade your kitchen with this comprehensive cookware set.', 149.95, NULL, 'cookware.jpg', 14.0, 10.0, 6.0, 4, NOW(), NOW()),
  ('Wireless Headphones', 'Immerse yourself in music with wireless headphones.', 119.99, NULL, 'headphones.jpg', 3.0, 2.5, 1.5, 1, NOW(), NOW()),
  ('Home Security Camera', 'Monitor your home with a smart security camera.', 89.50, NULL, 'security_camera.jpg', 3.5, 2.0, 2.0, 3, NOW(), NOW()),
  ('Vacuum Cleaner', 'Efficiently clean your home with a powerful vacuum.', 169.00, NULL, 'vacuum.jpg', 12.0, 9.0, 3.0, 2, NOW(), NOW()),
  ('Tablet Computer', 'Versatile tablet for work and entertainment.', 249.99, NULL, 'tablet.jpg', 9.5, 7.0, 0.4, 1, NOW(), NOW()),
  ('Indoor Plants Set', 'Bring nature indoors with a set of beautiful plants.', 49.95, NULL, 'plants.jpg', 1.0, 1.0, 1.0, 4, NOW(), NOW()),
  ('Smart Home Hub', 'Control your home devices with a smart hub.', 79.00, NULL, 'home_hub.jpg', 4.0, 4.0, 0.8, 3, NOW(), NOW());


-- Dummy data for warehouses
-- Insert 5 dummy records into the warehouses table
INSERT INTO `warehouses` (`name`, `address`, `total_volume`, `available_volume`, `created_at`, `updated_at`)
VALUES
  ('Warehouse A', '123 Main St, City A', 1000.00, 750.00, NOW(), NOW()),
  ('Warehouse B', '456 Elm St, City B', 1500.00, 1000.00, NOW(), NOW()),
  ('Warehouse C', '789 Oak St, City C', 800.00, 350.00, NOW(), NOW()),
  ('Warehouse D', '101 Pine St, City D', 2000.00, 1800.00, NOW(), NOW()),
  ('Warehouse E', '202 Maple St, City E', 1200.00, 900.00, NOW(), NOW());
-- Dummy data for inventories
-- Insert 10 dummy records into the inventory table
INSERT INTO `inventory` (`product_id`, `warehouse_id`, `quantity`, `created_at`, `updated_at`)
VALUES
  (1, 1, 100, NOW(), NOW()),
  (2, 2, 50, NOW(), NOW()),
  (3, 3, 200, NOW(), NOW()),
  (4, 4, 75, NOW(), NOW()),
  (5, 5, 120, NOW(), NOW()),
  (6, 1, 30, NOW(), NOW()),
  (7, 2, 80, NOW(), NOW()),
  (8, 3, 150, NOW(), NOW()),
  (9, 4, 90, NOW(), NOW()),
  (10, 5, 110, NOW(), NOW());

