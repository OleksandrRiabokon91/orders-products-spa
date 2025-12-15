import pool from "./db.js";

export const getOrderSummaryById = async (orderId) => {
  const query = `
    SELECT 
      o.id,
      o.title,
      o.description,
      o.date,
      DATE_FORMAT(o.date, '%d.%m.%Y %H:%i:%s') AS formattedDate,
      COUNT(DISTINCT p.id) AS productsCount,
      COALESCE(SUM(CASE WHEN pr.symbol = 'USD' THEN pr.value ELSE 0 END), 0) AS totalUSD,
      COALESCE(SUM(CASE WHEN pr.symbol = 'UAH' THEN pr.value ELSE 0 END), 0) AS totalUAH
    FROM orders o
    LEFT JOIN products p ON p.order_id = o.id
    LEFT JOIN prices pr ON pr.product_id = p.id
    WHERE o.id = ?
    GROUP BY o.id
  `;
  const [[order]] = await pool.promise().query(query, [orderId]);
  return order;
};
