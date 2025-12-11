import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import ordersRouter from "./routes/orders.js";
import productsRouter from "./routes/products.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

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

app.use(
  express.json({
    type: ["application/json"],
    limit: "100kb",
  })
);
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

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

const PORT = process.env.PORT || 4000;

server.listen(PORT, () =>
  console.log(`API + WS running on ${PORT} (CORS_ORIGIN=${CORS_ORIGIN})`)
);
