-- https://dev.mysql.com/doc/refman/8.0/en/roles.html#roles-creating-granting

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

-- Drop user 
DROP USER 'admin'@'localhost';
DROP USER 'customer'@'localhost';
DROP USER 'seller'@'localhost';

-- Set role to user
GRANT 'admin' TO 'admin'@'localhost';
GRANT 'customer' TO 'customer'@'localhost';
GRANT 'seller' TO 'seller'@'localhost';

-- Revoke priviledges of roles
REVOKE ALL PRIVILEGES ON lazada_ecommerce.* FROM 'admin'@'localhost';

REVOKE ALL PRIVILEGES ON lazada_ecommerce.* FROM 'customer'@'localhost';

REVOKE ALL PRIVILEGES ON lazada_ecommerce.* FROM 'seller'@'localhost';

show grants for 'admin'@'localhost';

ALTER USER 'admin'@'localhost' IDENTIFIED BY 'Ladmin';
ALTER USER 'customer'@'localhost' IDENTIFIED BY 'Lcustomer';
ALTER USER 'seller'@'localhost' IDENTIFIED BY 'Lseller';

-- Create role
CREATE ROLE 'admin', 'customer', 'seller';
GRANT ALL PRIVILEGES ON lazada_ecommerce.* TO 'admin';
GRANT SELECT ON lazada_ecommerce.products TO 'customer';
GRANT INSERT, SELECT, UPDATE ON lazada_ecommerce.users_info TO 'customer';
GRANT INSERT, SELECT, UPDATE, DELETE ON lazada_ecommerce.products TO 'seller';
GRANT INSERT, SELECT, UPDATE ON lazada_ecommerce.users_info TO 'seller';
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'Ladmin';
CREATE USER 'customer'@'localhost' IDENTIFIED BY 'Lcustomer';
CREATE USER 'seller'@'localhost' IDENTIFIED BY 'Lseller';
GRANT 'admin' TO 'admin'@'localhost';
GRANT 'customer' TO 'customer'@'localhost';
GRANT 'seller' TO 'seller'@'localhost';