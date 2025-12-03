// SQL-запросы / работа с БД для заказов
const db = require("../utils/db");

exports.getAllOrders = (callback) => {
  db.query("SELECT * FROM orders", callback);
};
