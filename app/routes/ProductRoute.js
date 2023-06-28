import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/ProductController.js";
import { verifyUser } from "../middlewares/AuthMiddleware.js";

const router = express.Router();


router.get("/products",verifyUser, getProducts);
router.get("/products/:id",verifyUser, getProductById);
router.post("/products",verifyUser, createProduct);
router.put("/products/:id",verifyUser, updateProduct);
router.delete("/products/:id",verifyUser, deleteProduct);

export default router;
