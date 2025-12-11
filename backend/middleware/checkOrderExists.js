import pool from "../utils/db.js";

export default async function checkOrderExists(req, res, next) {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      throw createHttpError(400, "Order id is required");
    }
    const [rows] = await pool
      .promise()
      .query("SELECT id FROM orders WHERE id = ? LIMIT 1", [orderId]);
    if (!rows.length) {
      throw createHttpError(404, "Order not found");
    }
    req.orderId = orderId;
    next();
  } catch (err) {
    next(err);
  }
}
