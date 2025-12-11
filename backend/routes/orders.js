import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
} from "../controllers/ordersController.js";
import {
  createProductForOrder,
  deleteProduct,
  getProducts,
} from "../controllers/productsController.js";
import checkOrderExists from "../middleware/checkOrderExists.js";
import { validateOrder } from "../validation/orderValidation.js";
import { validateProduct } from "../validation/productValidation.js";

const router = express.Router();

router.get("/", getAllOrders);
router.get(
  "/:id",
  // checkOrderExists,
  getOrderById
);
router.post(
  "/",
  // validateOrder,
  createOrder
);
router.delete("/:id", checkOrderExists, deleteOrder);
router.get(
  "/:id/products",
  // checkOrderExists,
  getProducts
);
router.post(
  "/:id/products",
  // checkOrderExists,
  // validateProduct,
  createProductForOrder
);
router.delete("/:id/products/:productId", deleteProduct);

export default router;
