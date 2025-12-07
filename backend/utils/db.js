import mysql from "mysql2"; // импорт через ESM

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // хост базы (из .env)
  user: process.env.DB_USER || "user", // пользователь базы
  password: process.env.DB_PASSWORD || "password", // пароль
  database: process.env.DB_NAME || "orders_products", // имя базы
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});

export default pool; // экспортируем пул
