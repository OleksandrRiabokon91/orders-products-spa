import pool from "../utils/db.js";
import formatDateForMySQL from "../utils/formatDateForMySQL.js";
import { getOrderProductsByOrderId } from "../utils/getOrderProductsByOrderId.js";
import { getOrderSummaryById } from "../utils/getOrderSummaryById.js";
import { createProductForOrder } from "./productsController.js";
import createHttpError from "http-errors";

// ! протестирован - не менять
export const getAllOrders = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        o.id,
        o.title,
        o.date,
        DATE_FORMAT(o.date, '%d.%m.%Y %H:%i:%s') AS formattedDate,
        COUNT(DISTINCT p.id) AS productsCount,
        COALESCE(SUM(CASE WHEN pr.symbol = 'USD' THEN pr.value ELSE 0 END), 0) AS totalUSD,
        COALESCE(SUM(CASE WHEN pr.symbol = 'UAH' THEN pr.value ELSE 0 END), 0) AS totalUAH
      FROM orders o
      LEFT JOIN products p ON p.order_id = o.id
      LEFT JOIN prices pr ON pr.product_id = p.id
      GROUP BY o.id
      ORDER BY o.date DESC
    `;
    const [results] = await pool.promise().query(query);
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

// ! протестирован - не менять
export const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const orderSummary = await getOrderSummaryById(orderId);
    if (!orderSummary) {
      throw createHttpError(404, "Order not found");
    }
    const products = await getOrderProductsByOrderId(orderId);
    return res.status(200).json({
      ...orderSummary,
      products,
    });
  } catch (err) {
    next(err);
  }
};

// ! протестирован - не менять
export const createOrder = async (req, res, next) => {
  try {
    const { title, description, date, products } = req.body;
    const insertOrderQuery = `
      INSERT INTO orders (title, description, date)
      VALUES (?, ?, ?)
    `;
    const formattedDate = formatDateForMySQL(date || new Date());
    const [orderResult] = await pool
      .promise()
      .query(insertOrderQuery, [title, description, formattedDate]);
    const orderId = orderResult.insertId;
    let productsArray = null;
    if (products) {
      productsArray = Array.isArray(products) ? products : [products];
    }
    if (Array.isArray(productsArray) && productsArray.length > 0) {
      for (const product of productsArray) {
        const fakeReq = {
          params: { id: orderId },
          body: { ...product, order_id: orderId },
        };
        const fakeRes = {
          status: () => fakeRes,
          json: () => {},
        };
        await createProductForOrder(fakeReq, fakeRes, next);
      }
    }
    const orderSummary = await getOrderSummaryById(orderId);
    const orderProducts = await getOrderProductsByOrderId(orderId);
    return res.status(201).json({
      ...orderSummary,
      products: orderProducts,
    });
  } catch (err) {
    next(err);
  }
};
// ! протестирован - не менять
export const deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.orderId;
    const [result] = await pool
      .promise()
      .query("DELETE FROM orders WHERE id = ?", [orderId]);
    if (result.affectedRows === 0) {
      throw createHttpError(404, "Order not found");
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
