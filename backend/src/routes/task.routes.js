import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import { validateTaskCreate, validateTaskUpdate, validateTaskId } from "../validators/task.validator.js";

const router = Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, validateTaskCreate, createTask);
router.put("/:id", authMiddleware, validateTaskId, validateTaskUpdate, updateTask);
router.delete("/:id", authMiddleware, validateTaskId, deleteTask);

export default router;