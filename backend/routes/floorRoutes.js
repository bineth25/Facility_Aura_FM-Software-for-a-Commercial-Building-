import express from "express";
import { getFloors, addFloor } from "../controllers/floorController.js";

const router = express.Router();

router.get("/", getFloors);
router.post("/", addFloor);

export default router;
