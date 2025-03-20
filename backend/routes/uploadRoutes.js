import express from "express";
import { deleteTaskById, getAllTasks, getTaskById, updateTaskById, upload, uploadTask } from "../controllers/uploadController.js";

const router = express.Router();

// Route to handle image upload and task creation
router.post("/upload", upload.single("image"), uploadTask);
router.get("/getall",getAllTasks);
router.get("/:id", getTaskById);
router.put("/update/:id", upload.single("image"), updateTaskById);
router.delete("/delete/:id", deleteTaskById);


export default router;
