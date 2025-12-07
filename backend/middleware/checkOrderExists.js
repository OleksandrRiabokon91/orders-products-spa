import pool from "../utils/db.js";

export default function checkOrderExists(req, res, next) {
  const orderId = req.params.id;
  if (!orderId) {
    return res.status(400).json({ error: "Order id is required" });
  }
  pool.query(
    "SELECT id FROM orders WHERE id = ? LIMIT 1",
    [orderId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) {
        return res
          .status(404)
          .json({ error: "Order with this id does not exist" });
      }
      req.orderId = orderId;
      next();
    }
  );
}
