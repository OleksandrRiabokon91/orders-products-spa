import createHttpError from "http-errors";
import pool from "../utils/db.js";
import formatDateForMySQL from "../utils/formatDateForMySQL.js";
import { getUSDUAHRate, convertPrice } from "../utils/getUSDUAHRate.js";
// ! протестирован - не менять
// GET /products
// GET /orders/:id/products
// GET /products?type=Monitors
// GET /orders/:id/products?type=Monitors
//* if not found id-order or filtered products => return []
export const getProducts = async (req, res, next) => {
  try {
    const orderId = req.params.id || null;
    const { type } = req.query;
    let productSql = `
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
    `;
    const conditions = [];
    const params = [];
    if (orderId) {
      conditions.push("p.order_id = ?");
      params.push(orderId);
    }
    if (type) {
      conditions.push("p.type = ?");
      params.push(type);
    }
    if (conditions.length) {
      productSql += " WHERE " + conditions.join(" AND ");
    }
    productSql += " ORDER BY p.date DESC";
    const [products] = await pool.promise().query(productSql, params);
    if (!products.length) {
      return res.status(200).json([]);
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
    // Сборка итоговой структуры
    const productsWithDetails = products.map((product) => {
      const productPrices = prices
        .filter((pr) => pr.product_id === product.id)
        .map((pr) => ({
          value: Number(pr.value).toFixed(2),
          symbol: pr.symbol,
          isDefault: pr.isDefault,
        }));
      const g = guarantees.find((g) => g.product_id === product.id);
      const guaranteeObj = g
        ? {
            product_id: g.product_id,
            start: new Date(g.start).toISOString(),
            end: new Date(g.end).toISOString(),
          }
        : null;
      return {
        id: product.id,
        title: product.title,
        serialNumber: product.serialNumber,
        type: product.type,
        specification: product.specification,
        isNew: Number(product.isNew),
        photo: product.photo,
        date: new Date(product.date).toISOString(),
        price: productPrices,
        guarantee: guaranteeObj,
      };
    });
    return res.status(200).json(productsWithDetails);
  } catch (err) {
    next(err);
  }
};
// ! протестирован - не менять
export const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
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
        p.date,
        o.title AS orderTitle
      FROM products p
      LEFT JOIN orders o ON o.id = p.order_id
      WHERE p.id = ?
      `,
      [productId]
    );
    if (!products.length) {
      throw createHttpError(404, "Product not found");
    }
    const product = products[0];
    const [prices] = await pool.promise().query(
      `
      SELECT value, symbol, isDefault
      FROM prices
      WHERE product_id = ?
      `,
      [productId]
    );
    const [guaranteeRows] = await pool.promise().query(
      `
      SELECT product_id, start, end
      FROM guarantees
      WHERE product_id = ?
      `,
      [productId]
    );
    const guarantee = guaranteeRows.length ? guaranteeRows[0] : null;
    const response = {
      ...product,
      price: prices.map((pr) => ({
        value: pr.value,
        symbol: pr.symbol,
        isDefault: pr.isDefault,
      })),
      guarantee,
    };
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
// ! протестирован - не менять
// can use alone=> post Product
// can usd in=> post Order Arr<Products[]>[{product},...]
// post Order can be empty-without product Arr<Products[]>[]
export const createProductForOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id || req.body.order_id;
    const {
      serialNumber,
      isNew,
      photo,
      title,
      type,
      specification,
      guarantee_start,
      guarantee_end,
      date,
      price,
      inputCurrency,
    } = req.body;
    const rate = await getUSDUAHRate();
    // Конвертация цены в обе валюты
    const { usd: price_usd, uah: price_uah } = convertPrice(
      price,
      inputCurrency,
      rate
    );
    const insertProductQuery = `
      INSERT INTO products
        (serialNumber, isNew, photo, title, type, specification, order_id, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [productResult] = await pool
      .promise()
      .query(insertProductQuery, [
        serialNumber,
        isNew,
        photo,
        title,
        type,
        specification,
        orderId,
        formatDateForMySQL(date),
      ]);
    const productId = productResult.insertId;
    const insertGuaranteeQuery = `
      INSERT INTO guarantees (product_id, start, end)
      VALUES (?, ?, ?)
    `;
    await pool
      .promise()
      .query(insertGuaranteeQuery, [
        productId,
        formatDateForMySQL(guarantee_start),
        formatDateForMySQL(guarantee_end),
      ]);
    //! Дефолтная валюта для всей базы = UAH
    //! При изменении дефолтной валюты в базе соответственно изменить значение DEFAULT_CURRENCY
    const DEFAULT_CURRENCY = "UAH";
    await pool.promise().query(
      `INSERT INTO prices (product_id, value, symbol, isDefault)
       VALUES (?, ?, 'USD', ?), (?, ?, 'UAH', ?)`,
      [
        productId,
        price_usd,
        DEFAULT_CURRENCY === "USD" ? 1 : 0,
        productId,
        price_uah,
        DEFAULT_CURRENCY === "UAH" ? 1 : 0,
      ]
    );
    //Получаем продукт из базы с JOIN, чтобы вернуть единообразный ответ
    const [rows] = await pool.promise().query(
      `SELECT
          p.id,
          p.title,
          p.serialNumber,
          p.type,
          p.specification,
          p.isNew,
          p.photo,
          p.date,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'value', pr.value,
              'symbol', pr.symbol,
              'isDefault', pr.isDefault
            )
          ) AS price,
          JSON_OBJECT(
            'product_id', g.product_id,
            'start', g.start,
            'end', g.end
          ) AS guarantee
       FROM products p
       LEFT JOIN prices pr ON pr.product_id = p.id
       LEFT JOIN guarantees g ON g.product_id = p.id
       WHERE p.id = ?
       GROUP BY p.id`,
      [productId]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};
// ! протестирован - не менять
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      throw createHttpError(400, "Product id is required");
    }
    const [result] = await pool
      .promise()
      .query("DELETE FROM products WHERE id = ?", [productId]);
    if (result.affectedRows === 0) {
      throw createHttpError(404, "Product not found");
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
