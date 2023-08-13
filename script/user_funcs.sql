-- funcs

-- Generate ULID from datetime
delimiter //
DROP FUNCTION IF EXISTS ULID_FROM_DATETIME//
CREATE FUNCTION ULID_FROM_DATETIME (t DATETIME) RETURNS CHAR(26) DETERMINISTIC
BEGIN
RETURN ULID_ENCODE(CONCAT(UNHEX(CONV(UNIX_TIMESTAMP(t) * 1000, 10, 16)), binary(10)));
END//
delimiter ;

-- stored procedures ----
--- update inventory on order accept ---
DELIMITER //
DROP PROCEDURE IF EXISTS UPDATE_INVENTORY_ON_ORDER_ACCEPT;
CREATE PROCEDURE UPDATE_INVENTORY_ON_ORDER_ACCEPT(IN order_id INT)
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
        SET i.quantity = i.quantity - item_quantity,
            i.reserved_quantity = i.reserved_quantity + item_quantity
        WHERE i.id = item_inventory_id;

    END LOOP;
    CLOSE cur;

    SET  v_last_row_fetched=0;

    UPDATE orders SET status = 'accepted' WHERE id = order_id;
END;
//
DELIMITER ;


