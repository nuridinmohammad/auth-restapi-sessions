import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/UserController.js";
import { isAdmin, verifyUser } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/users", verifyUser, isAdmin, getUsers);
router.get("/users/:id", verifyUser, isAdmin, getUserById);
router.post("/users", verifyUser, isAdmin, createUser);
router.put("/users/:id", verifyUser, isAdmin, updateUser);
router.delete("/users/:id", verifyUser, isAdmin, deleteUser);

export default router;
