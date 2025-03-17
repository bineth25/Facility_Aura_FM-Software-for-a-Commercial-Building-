import express from "express";
import { getSpacesByFloor, addSpace } from "../controllers/spaceController.js";

const router = express.Router();

router.get("/:floorId", getSpacesByFloor);
router.post("/", addSpace);

export default router;
