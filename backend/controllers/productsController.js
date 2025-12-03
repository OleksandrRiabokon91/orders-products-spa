const Product = require("../models/productModel");

exports.getProducts = (req, res) => {
  Product.getAllProducts((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
