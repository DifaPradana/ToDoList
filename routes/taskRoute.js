import express from "express";
import {
  getTasks,
  createTask,
  editTask,
  deleteTask,
} from "../controllers/TaskController.js";

const router = express.Router();

router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.put("/tasks/:id", editTask);
router.delete("/tasks/:id", deleteTask);

export default router;
