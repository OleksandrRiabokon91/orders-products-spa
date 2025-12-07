import pool from "../utils/db.js";
import formatDateForMySQL from "../utils/formatDateForMySQL.js";
import createError from "http-errors";

export const getProducts = (req, res, next) => {
  const orderId = req.params.id;
  const { type } = req.query;
  let query = `
    SELECT p.*, o.title AS orderTitle
    FROM products p
    LEFT JOIN orders o ON o.id = p.order_id
  `;
  const params = [];
  const conditions = [];
  if (orderId) {
    conditions.push("p.order_id = ?");
    params.push(orderId);
  }
  if (type) {
    conditions.push("p.type = ?");
    params.push(type);
  }
  if (conditions.length) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY p.date DESC";
  pool.query(query, params, (err, results) => {
    if (err) return next(err);
    res.status(200).json(results);
  });
};

export const getProductById = (req, res, next) => {
  const { id } = req.params;
  const query = `
    SELECT p.*, o.title AS orderTitle
    FROM products p
    LEFT JOIN orders o ON o.id = p.order_id
    WHERE p.id = ?
  `;
  pool.query(query, [id], (err, results) => {
    if (err) return next(err);
    if (!results.length) return next(createError(404, "Product not found"));
    res.status(200).json(results[0]);
  });
};

export const createProductForOrder = (req, res, next) => {
  const orderId = req.params.id;
  const {
    serialNumber,
    isNew,
    photo,
    title,
    type,
    specification,
    guarantee_start,
    guarantee_end,
    price_usd,
    price_uah,
    date,
  } = req.body;
  const guaranteeStart = formatDateForMySQL(guarantee_start);
  const guaranteeEnd = formatDateForMySQL(guarantee_end);
  const productDate = formatDateForMySQL(date);
  const query = `
    INSERT INTO products
      (serialNumber, isNew, photo, title, type, specification, guarantee_start, guarantee_end, price_usd, price_uah, order_id, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  pool.query(
    query,
    [
      serialNumber,
      isNew,
      photo,
      title,
      type,
      specification,
      guaranteeStart,
      guaranteeEnd,
      price_usd,
      price_uah,
      orderId,
      productDate,
    ],
    (err, result) => {
      if (err) return next(err);
      res
        .status(201)
        .json({ id: result.insertId, ...req.body, order_id: orderId });
    }
  );
};

export const deleteProductFromOrder = (req, res, next) => {
  const { productId } = req.params;
  const query = "DELETE FROM products WHERE id = ?";
  pool.query(query, [productId], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0)
      return next(createError(404, "Product not found"));
    return res.status(204).send();
  });
};
