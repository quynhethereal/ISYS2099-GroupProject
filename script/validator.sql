PATH: script/vali.sql

-- STORED PROCEDURES

-- Validate data of 'users' table
DROP PROCEDURE IF EXISTS validate_users;
DELIMITER $$
CREATE PROCEDURE validate_users(
    IN username VARCHAR(255) 
)
DETERMINISTIC
NO SQL
BEGIN
    IF CHAR_LENGTH(username) < 3 OR CHAR_LENGTH(username) > 20 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username must be between 3 and 20 characters';
    END IF;
END$$
DELIMITER ;

-- Validate data of 'users_info' table
DROP PROCEDURE IF EXISTS validate_users_info;
DELIMITER $$
CREATE PROCEDURE validate_users_info(
    IN first_name VARCHAR(255),
    IN last_name VARCHAR(255),
    IN role VARCHAR(255),
    IN email VARCHAR(255),
    IN phone VARCHAR(255) 
)
DETERMINISTIC
NO SQL
BEGIN
    IF NOT (first_name REGEXP '^[A-Za-z]+$') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid first name format';
    END IF;
    IF NOT (last_name REGEXP '^[A-Za-z]+$') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid last name format';
    END IF;
    IF role NOT IN ('customer', 'seller', 'admin') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Role must be customer, seller, or admin';
    END IF;
    IF email NOT REGEXP '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
    IF phone NOT REGEXP '^[0-9]{10}$' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Phone number must have exactly 10 digits';
    END IF;
END$$
DELIMITER ;

-- TRIGGERS
    -- DROP TRIGGER IF EXISTS validate_users_insert;
    -- DROP TRIGGER IF EXISTS validate_users_update;
    -- DROP TRIGGER IF EXISTS validate_users_info_insert;
    -- DROP TRIGGER IF EXISTS validate_users_info_update;
    
-- Validate data of 'users' table before insertion
DELIMITER $$
CREATE TRIGGER validate_users_insert
BEFORE INSERT ON users FOR EACH ROW
BEGIN
	CALL validate_users(NEW.username);
END$$
DELIMITER ;

-- Validate data of 'users' table before update
DELIMITER $$
CREATE TRIGGER validate_users_update
BEFORE UPDATE ON users FOR EACH ROW
BEGIN
	CALL validate_users(NEW.username);
END$$
DELIMITER ;


-- Validate data of 'users_info' table before insertion
DELIMITER $$
CREATE TRIGGER validate_users_info_insert
BEFORE INSERT ON users_info FOR EACH ROW
BEGIN
	CALL validate_users_info(NEW.first_name, NEW.last_name, NEW.role, NEW.email, NEW.phone);
END$$
DELIMITER ;


-- Validate data of 'users_info' table before update
DELIMITER $$
CREATE TRIGGER validate_users_info_update
BEFORE UPDATE ON users_info FOR EACH ROW
BEGIN
	CALL validate_users_info(NEW.first_name, NEW.last_name, NEW.role, NEW.email, NEW.phone);
END$$
DELIMITER ;