const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const ordersRoutes = require("./routes/orders");
const productsRoutes = require("./routes/products");

app.use("/orders", ordersRoutes);
app.use("/products", productsRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
