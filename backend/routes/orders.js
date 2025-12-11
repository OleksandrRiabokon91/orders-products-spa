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
import { validateBody } from "../middleware/validateBody.js";
import { createOrderSchema } from "../validation/orderValidation.js";
import { createProductSchema } from "../validation/productValidation.js";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", checkOrderExists, getOrderById);
router.post("/", validateBody(createOrderSchema), createOrder);
router.delete("/:id", checkOrderExists, deleteOrder);
router.get("/:id/products", checkOrderExists, getProducts);
router.post(
  "/:id/products",
  checkOrderExists,
  validateBody(createProductSchema),
  createProductForOrder
);
router.delete("/:id/products/:productId", checkOrderExists, deleteProduct);

export default router;
