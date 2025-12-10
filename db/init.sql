CREATE DATABASE IF NOT EXISTS orders_products;
USE orders_products;

CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    serialNumber INT,
    isNew TINYINT,
    photo VARCHAR(255),
    title VARCHAR(255),
    type VARCHAR(100),
    specification TEXT,
    order_id INT,
    date DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS guarantees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT UNIQUE,
    start DATETIME,
    end DATETIME,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    value DECIMAL(10,2),
    symbol VARCHAR(10),     
    isDefault TINYINT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Генерация тестовых данных

INSERT INTO orders (title, date, description)
SELECT CONCAT('Order ', n), NOW(), CONCAT('Description for order ', n)
FROM (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
) AS nums;

INSERT INTO products (serialNumber, isNew, photo, title, type, specification, order_id, date)
SELECT 
    1000 + n,
    FLOOR(RAND()*2),
    'pathToFile.jpg',
    CONCAT('Product ', n),
    CASE WHEN n%4=1 THEN 'Monitors'
         WHEN n%4=2 THEN 'Laptops'
         WHEN n%4=3 THEN 'Keyboards'
         ELSE 'Mice' END,
    CONCAT('Specification ', n),
    FLOOR(1 + RAND()*8),
    NOW()
FROM (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL 
    SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL 
    SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL 
    SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL 
    SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
) AS nums;

INSERT INTO guarantees (product_id, start, end)
SELECT id, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR)
FROM products;

INSERT INTO prices (product_id, value, symbol, isDefault)
SELECT id, ROUND(RAND()*500,2), 'USD', 0
FROM products;

INSERT INTO prices (product_id, value, symbol, isDefault)
SELECT id, ROUND(RAND()*15000,2), 'UAH', 1
FROM products;
