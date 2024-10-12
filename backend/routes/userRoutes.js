import express from "express";
import passport from "passport";
import {
  followUnfollowUser,
  getGoogleUser,
  getSuggestedUsers,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Generate JWT for Google authenticated user
    generateTokenAndSetCookie(req.user._id, res);
    res.redirect("https://threads-react.onrender.com/");
  }
);
router.get("/googleProfile", protectRoute, getGoogleUser);

export default router;
