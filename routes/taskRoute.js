import express from "express";
import {
  getTasks,
  createTask,
  editTask,
  deleteTask,
} from "../controllers/TaskController.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/tasks", verifyToken, getTasks);
router.post("/tasks", verifyToken, createTask);
router.put("/tasks/:id", verifyToken, editTask);
router.delete("/tasks/:id", verifyToken, deleteTask);

export default router;
