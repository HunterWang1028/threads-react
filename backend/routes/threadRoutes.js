import express from "express";
import {
  commentToThread,
  createThread,
  deleteThread,
  getFeedThreads,
  getThreadById,
  getUserThreads,
  likeUnlikeThread,
} from "../controllers/threadController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedThreads);
router.get("/:id", getThreadById);
router.get("/user/:username", getUserThreads);

router.post("/create", protectRoute, createThread);
router.put("/like/:id", protectRoute, likeUnlikeThread);
router.post("/comment/:id", protectRoute, commentToThread);

router.delete("/:id", protectRoute, deleteThread);
export default router;
