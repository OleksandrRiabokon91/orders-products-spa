import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "orders_products",
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});

export default pool;
