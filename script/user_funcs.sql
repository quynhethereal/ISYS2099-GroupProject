-- Create the database if not exists
DROP DATABASE IF EXISTS `lazada_ecommerce`;
CREATE DATABASE IF NOT EXISTS `lazada_ecommerce`;

USE lazada_ecommerce;

-- Generate ULID from datetime
delimiter //
drop function IF EXISTS ULID_ENCODE//
create function ULID_ENCODE (b BINARY(16)) RETURNS CHAR(26) deterministic
BEGIN
DECLARE s_hex CHAR(32);
SET s_hex = LPAD(HEX(b), 32, '0');
RETURN REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(CONCAT(LPAD(CONV(SUBSTRING(s_hex, 1, 2), 16, 32), 2, '0'), LPAD(CONV(SUBSTRING(s_hex, 3, 15), 16, 32), 12, '0'), LPAD(CONV(SUBSTRING(s_hex, 18, 15), 16, 32), 12, '0')), 'V', 'Z'), 'U', 'Y'), 'T', 'X'), 'S', 'W'), 'R', 'V'), 'Q', 'T'), 'P', 'S'), 'O', 'R'), 'N', 'Q'), 'M', 'P'), 'L', 'N'), 'K', 'M'), 'J', 'K'), 'I', 'J');
END//
delimiter ;

delimiter //
drop function IF EXISTS ULID_FROM_DATETIME//
create function ULID_FROM_DATETIME (t DATETIME) RETURNS CHAR(26) deterministic
BEGIN
DECLARE random_bytes BINARY(10);
SET random_bytes = RANDOM_BYTES(10);
RETURN ULID_ENCODE(CONCAT(UNHEX(CONV(UNIX_TIMESTAMP(t) * 1000, 10, 16)), random_bytes));
END//
delimiter ;

-- update inventory on order accept

drop procedure IF EXISTS UPDATE_INVENTORY_ON_ORDER_ACCEPT;
DELIMITER //
create procedure UPDATE_INVENTORY_ON_ORDER_ACCEPT(IN order_id INT)
BEGIN
    DECLARE item_inventory_id VARCHAR(255);
    DECLARE item_quantity INT;

    DECLARE v_last_row_fetched INT DEFAULT 0;
    DECLARE cur CURSOR FOR SELECT o.inventory_id, o.quantity FROM order_items o WHERE o.order_id = order_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_last_row_fetched=1;


    OPEN cur;
        read_loop: LOOP
            FETCH cur INTO item_inventory_id, item_quantity;
            IF v_last_row_fetched=1 THEN
                LEAVE read_loop;
            END IF;

            UPDATE inventory i
            -- deduce quantity from actual quantity and reserved quantity
            SET i.quantity = i.quantity - item_quantity,
                i.reserved_quantity = i.reserved_quantity - item_quantity
            WHERE i.id = item_inventory_id;

        END LOOP;
        CLOSE cur;

        SET  v_last_row_fetched=0;
END;
//
DELIMITER ;

-- end of update inventory on order accept

-- update inventory on order rejected

drop procedure IF EXISTS UPDATE_INVENTORY_ON_ORDER_REJECT;
DELIMITER //
create procedure UPDATE_INVENTORY_ON_ORDER_REJECT(IN order_id INT)
BEGIN
    DECLARE item_inventory_id VARCHAR(255);
    DECLARE item_quantity INT;

    DECLARE v_last_row_fetched INT DEFAULT 0;
    DECLARE cur CURSOR FOR SELECT o.inventory_id, o.quantity FROM order_items o WHERE o.order_id = order_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_last_row_fetched=1;


    OPEN cur;
        read_loop: LOOP
            FETCH cur INTO item_inventory_id, item_quantity;
            IF v_last_row_fetched=1 THEN
                LEAVE read_loop;
            END IF;

            UPDATE inventory i
            SET i.reserved_quantity = i.reserved_quantity - item_quantity
            WHERE i.id = item_inventory_id;

        END LOOP;
        CLOSE cur;

        SET  v_last_row_fetched=0;
END;
//
DELIMITER ;

-- end of update inventory on order reject

drop procedure IF EXISTS ASSIGN_INVENTORY_TO_WAREHOUSE;
DELIMITER $$
create procedure ASSIGN_INVENTORY_TO_WAREHOUSE(IN product_id INT, IN total_quantity INT, OUT pending_items_count INT)
BEGIN
     DECLARE items_to_stock INT;
     DECLARE max_warehouse_id INT;
     DECLARE max_available_volume DECIMAL(10,2);
     DECLARE remaining_quantity INT DEFAULT total_quantity;
     DECLARE product_unit_size DECIMAL(10,2);
     DECLARE has_warehouse INT DEFAULT 0;
     DECLARE inventory_row_id VARCHAR(255);


    DECLARE EXIT handler FOR SQLEXCEPTION
      BEGIN
        ROLLBACK;
        RESIGNAL;
      END;

    SELECT (width * length * height) INTO product_unit_size FROM products WHERE id = product_id;

     IF product_unit_size IS NULL THEN
     begin
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found';
     end;
     END IF;


    add_loop: WHILE remaining_quantity > 0 AND has_warehouse = 0 DO

        START TRANSACTION;

        SELECT id, available_volume INTO max_warehouse_id, max_available_volume
          FROM warehouses WHERE available_volume = (SELECT MAX(available_volume) FROM warehouses) LIMIT 1 FOR UPDATE;

           SET items_to_stock = LEAST(remaining_quantity, FLOOR(max_available_volume / product_unit_size));

            IF items_to_stock = 0 THEN
                -- insert into pending inventory
                INSERT INTO pending_inventory (product_id, quantity) VALUES (product_id, remaining_quantity);
                SET pending_items_count = remaining_quantity;
                SET remaining_quantity = 0;
                SET has_warehouse = 1;
                COMMIT;
                LEAVE add_loop;
            END IF;

            -- see if the product is already in the warehouse
            SELECT id INTO inventory_row_id FROM inventory i WHERE i.product_id = product_id AND warehouse_id = max_warehouse_id LIMIT 1;

            -- if the product is already in the warehouse, update the quantity
            IF inventory_row_id IS NOT NULL THEN
                UPDATE inventory i SET quantity = quantity + items_to_stock WHERE i.product_id = product_id AND warehouse_id = max_warehouse_id;
            -- else insert the product into the warehouse
            ELSE
                INSERT INTO inventory (product_id, warehouse_id, quantity, reserved_quantity)
                VALUES (product_id, max_warehouse_id, items_to_stock, 0);
            END IF;

            UPDATE warehouses w SET available_volume = available_volume - (items_to_stock * product_unit_size) WHERE w.id = max_warehouse_id;

            SET remaining_quantity = remaining_quantity - items_to_stock;
            COMMIT;

            -- reset variables
            SET max_warehouse_id = NULL;
            SET max_available_volume = NULL;
            SET items_to_stock = NULL;
            SET inventory_row_id = NULL;
    END WHILE;
END;
$$
DELIMITER ;
