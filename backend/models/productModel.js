// SQL-запросы / работа с БД для продуктов
const db = require("../utils/db");

exports.getAllProducts = (callback) => {
  db.query("SELECT * FROM products", callback);
};
