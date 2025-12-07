-- Создаем базу
CREATE DATABASE IF NOT EXISTS orders_products;
USE orders_products;

-- Таблица Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    date DATETIME,
    description TEXT
);

-- Таблица Products
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    serialNumber INT,
    isNew TINYINT,
    photo VARCHAR(255),
    title VARCHAR(255),
    type VARCHAR(100),
    specification TEXT,
    guarantee_start DATETIME,
    guarantee_end DATETIME,
    price_usd DECIMAL(10,2),
    price_uah DECIMAL(10,2),
    order_id INT,
    date DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Генерация 8 заказов
INSERT INTO orders (title, date, description)
SELECT CONCAT('Order ', n), NOW(), CONCAT('Description for order ', n)
FROM (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
) AS nums;

-- Генерация 20 продуктов с распределением по заказам 1-8
INSERT INTO products (serialNumber, isNew, photo, title, type, specification, guarantee_start, guarantee_end, price_usd, price_uah, order_id, date)
SELECT 1000 + n, FLOOR(RAND()*2), 'pathToFile.jpg', CONCAT('Product ', n),
       CASE WHEN n%4=1 THEN 'Monitors'
            WHEN n%4=2 THEN 'Laptops'
            WHEN n%4=3 THEN 'Keyboards'
            ELSE 'Mice' END,
       CONCAT('Specification ', n),
       NOW(), NOW(),
       ROUND(RAND()*500, 2), ROUND(RAND()*15000, 2),
       FLOOR(1 + RAND()*8), NOW()
FROM (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
    UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
    UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
    UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
) AS nums;
