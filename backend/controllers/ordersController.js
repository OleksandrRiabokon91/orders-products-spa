const Order = require("../models/orderModel");

exports.getOrders = (req, res) => {
  Order.getAllOrders((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
