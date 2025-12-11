import pool from "../utils/db.js";
import formatDateForMySQL from "../utils/formatDateForMySQL.js";
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
    const [orders] = await pool.promise().query(
      `
      SELECT 
        o.id,
        o.title,
        o.date,
        DATE_FORMAT(o.date, '%d.%m.%Y %H:%i:%s') AS formattedDate
      FROM orders o
      WHERE o.id = ?
      `,
      [orderId]
    );
    if (!orders.length) {
      throw createHttpError(404, "Order not found");
    }
    const order = orders[0];
    const [products] = await pool.promise().query(
      `
      SELECT 
        p.id,
        p.title,
        p.serialNumber,
        p.type,
        p.specification,
        p.isNew,
        p.photo,
        p.date
      FROM products p
      WHERE p.order_id = ?
      `,
      [orderId]
    );
    if (!products.length) {
      return res.status(200).json({
        ...order,
        products: [],
        productsCount: 0,
        totalUSD: 0,
        totalUAH: 0,
      });
    }
    const productIds = products.map((p) => p.id);
    const [prices] = await pool.promise().query(
      `
      SELECT product_id, value, symbol, isDefault
      FROM prices
      WHERE product_id IN (?)
      `,
      [productIds]
    );
    const [guarantees] = await pool.promise().query(
      `
      SELECT product_id, start, end
      FROM guarantees
      WHERE product_id IN (?)
      `,
      [productIds]
    );
    const productsWithDetails = products.map((product) => {
      const productPrices = prices
        .filter((pr) => pr.product_id === product.id)
        .map((pr) => ({
          value: pr.value,
          symbol: pr.symbol,
          isDefault: pr.isDefault,
        }));
      const productGuarantee = guarantees.find(
        (g) => g.product_id === product.id
      );
      return {
        ...product,
        price: productPrices,
        guarantee: productGuarantee || null,
      };
    });
    let totalUSD = 0;
    let totalUAH = 0;
    prices.forEach((pr) => {
      if (pr.symbol === "USD") totalUSD += Number(pr.value);
      if (pr.symbol === "UAH") totalUAH += Number(pr.value);
    });
    const response = {
      ...order,
      products: productsWithDetails,
      productsCount: productsWithDetails.length,
      totalUSD: totalUSD.toFixed(2),
      totalUAH: totalUAH.toFixed(2),
    };
    return res.status(200).json(response);
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
    const [orderResult] = await pool
      .promise()
      .query(insertOrderQuery, [
        title,
        description,
        formatDateForMySQL(date || new Date()),
      ]);
    const orderId = orderResult.insertId;
    let createdProducts = [];
    let productsArray = products;
    if (products && !Array.isArray(products)) {
      productsArray = [products];
    }
    if (Array.isArray(productsArray) && productsArray.length > 0) {
      for (const product of productsArray) {
        // "фейковый" req/res для повторного использования контроллера createProductForOrder
        const fakeReq = {
          params: { id: orderId },
          body: { ...product, order_id: orderId },
        };
        const fakeRes = {
          status: () => fakeRes,
          json: (data) => createdProducts.push(data),
        };
        await createProductForOrder(fakeReq, fakeRes, next);
      }
    }
    return res.status(201).json({
      id: orderId,
      title,
      description,
      date: formatDateForMySQL(date || new Date()),
      products: createdProducts,
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
