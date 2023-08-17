-- funcs

-- Generate ULID from datetime
delimiter //
DROP FUNCTION IF EXISTS ULID_ENCODE//
CREATE FUNCTION ULID_ENCODE (b BINARY(16)) RETURNS CHAR(26) DETERMINISTIC
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
RETURN ULID_ENCODE(CONCAT(UNHEX(CONV(UNIX_TIMESTAMP(t) * 1000, 10, 16)), binary(10)));
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

         -- rollback transaction and bubble up errors if something bad happens
      DECLARE exit handler FOR SQLEXCEPTION, SQLWARNING
      BEGIN
        ROLLBACK;
        RESIGNAL;
      END;

  START TRANSACTION;

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

        UPDATE orders SET status = 'accepted' WHERE id = order_id;

        COMMIT;
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

      DECLARE exit handler FOR SQLEXCEPTION, SQLWARNING
      BEGIN
        ROLLBACK;
        RESIGNAL;
      END;

  START TRANSACTION;

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

        UPDATE orders SET status = 'rejected' WHERE id = order_id;

        COMMIT;
    END;
//
DELIMITER ;

-- end of update inventory on order reject
