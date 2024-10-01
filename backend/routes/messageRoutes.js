import express from "express";
import protectRoute from "../middlewares/protectRoute";
import { sendMessage } from "../controllers/messageController";

const router = express.Router();

router.post("/", protectRoute, sendMessage);

export default router;
