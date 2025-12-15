import pool from "./db.js";

export const getOrderProductsByOrderId = async (orderId) => {
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

  if (!products.length) return [];

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

  return products.map((product) => ({
    ...product,
    price: prices
      .filter((pr) => pr.product_id === product.id)
      .map((pr) => ({
        value: pr.value,
        symbol: pr.symbol,
        isDefault: pr.isDefault,
      })),
    guarantee: guarantees.find((g) => g.product_id === product.id) || null,
  }));
};
