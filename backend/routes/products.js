import express from "express";
import {
  getProducts,
  getProductById,
  deleteProduct,
} from "../controllers/productsController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
