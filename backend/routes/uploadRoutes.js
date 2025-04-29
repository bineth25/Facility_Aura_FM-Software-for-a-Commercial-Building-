import express from "express";
import { deleteTaskById, getAllTasks, getTaskById, updateTaskById, uploadTask } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/upload", uploadTask);
router.get("/getall", getAllTasks);
router.get("/:id", getTaskById);
router.put("/update/:id", updateTaskById);
router.delete("/delete/:id", deleteTaskById);

export default router;