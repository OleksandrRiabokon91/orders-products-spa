import express from "express";
import {
  getProducts,
  getProductById,
  deleteProductFromOrder,
} from "../controllers/productsController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProductFromOrder);

export default router;
