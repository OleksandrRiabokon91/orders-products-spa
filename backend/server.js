require("dotenv").config(); // подключаем .env в начале файла

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

//! ---------------- CORS ----------------
//! После завершения удалённых тестов удалить "*". Оставить только в .env CORS_ORIGIN (конкретный URL фронтенда или http://localhost:3000)

const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// ---------------- REST API ----------------
const ordersRoutes = require("./routes/orders");
const productsRoutes = require("./routes/products");

app.use("/orders", ordersRoutes);
app.use("/products", productsRoutes);

// ---------------- HTTP + WebSocket ----------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// ----------- WebSocket логика счётчика -----------
let activeSessions = 0;

io.on("connection", (socket) => {
  activeSessions++;
  io.emit("sessions", activeSessions);
  console.log("Client connected. Active:", activeSessions);

  socket.on("disconnect", () => {
    activeSessions--;
    io.emit("sessions", activeSessions);
    console.log("Client disconnected. Active:", activeSessions);
  });
});
// --------------------------------------------------

// ---------------- PORT ----------------
const PORT = process.env.PORT || 4000;

server.listen(PORT, () =>
  console.log(`API + WS running on ${PORT} (CORS_ORIGIN=${CORS_ORIGIN})`)
);
