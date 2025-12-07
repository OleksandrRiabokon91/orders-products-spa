import pool from "../utils/db.js";
import formatDateForMySQL from "../utils/formatDateForMySQL.js";
import createError from "http-errors";

export const getAllOrders = (req, res, next) => {
  const query = `
    SELECT o.*, 
           COUNT(p.id) AS productsCount,
           COALESCE(SUM(p.price_usd), 0) AS totalUSD,
           COALESCE(SUM(p.price_uah), 0) AS totalUAH
    FROM orders o
    LEFT JOIN products p ON p.order_id = o.id
    GROUP BY o.id
    ORDER BY o.date DESC
  `;
  pool.query(query, (err, results) => {
    if (err) return next(err);
    res.status(200).json(results);
  });
};

export const getOrderById = (req, res, next) => {
  const orderId = req.params.id;
  const orderQuery = "SELECT * FROM orders WHERE id = ?";
  pool.query(orderQuery, [orderId], (err, orders) => {
    if (err) return next(err);
    if (!orders.length) return next(createError(404, "Order not found"));
    const productsQuery = "SELECT * FROM products WHERE order_id = ?";
    pool.query(productsQuery, [orderId], (err2, products) => {
      if (err2) return next(err2);
      res.status(200).json({ ...orders[0], products });
    });
  });
};

export const createOrder = (req, res, next) => {
  const { title, description, date } = req.body;
  const mysqlDate = formatDateForMySQL(date);
  const query =
    "INSERT INTO orders (title, description, date) VALUES (?, ?, ?)";
  pool.query(query, [title, description, mysqlDate], (err, result) => {
    if (err) return next(err);
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      date: date || new Date(),
    });
  });
};

export const deleteOrder = (req, res, next) => {
  const { id } = req.params;
  const deleteProducts = "DELETE FROM products WHERE order_id = ?";
  const deleteOrderQuery = "DELETE FROM orders WHERE id = ?";
  pool.query(deleteProducts, [id], (err) => {
    if (err) return next(err);
    pool.query(deleteOrderQuery, [id], (err2, result) => {
      if (err2) return next(err2);
      if (result.affectedRows === 0)
        return next(createError(404, "Order not found"));
      return res.status(204).send();
    });
  });
};
