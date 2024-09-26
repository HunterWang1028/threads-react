import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  // fetch user profile either with username or userId
  // query is either username or userId
  const { query } = req.params;

  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getUserProfile: ", error.message);
  }
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in signupUser: ", error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in login User: ", error.message);
  }
};

export const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 }); // clear the cookie
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in logout User: ", error.message);
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //Unfollow
      // remove currentUser following
      await User.updateOne({ _id: req.user._id }, { $pull: { following: id } });
      // remove userToModify followers
      await User.updateOne({ _id: id }, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed Successfully" });
    } else {
      // Follow user
      // add currentUser following
      await User.updateOne({ _id: req.user._id }, { $push: { following: id } });
      // add userToModify followers
      await User.updateOne({ _id: id }, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "User followed Successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in follow/unfollow user: ", error.message);
  }
};

export const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let currentUser = await User.findById(userId);
    if (!currentUser) res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      currentUser.password = hashedPassword;
    }

    if (profilePic) {
      if (currentUser.profilePic) {
        await cloudinary.uploader.destroy(
          currentUser.profilePic.split("/".pop().split(".")[0])
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    currentUser.name = name || currentUser.name;
    currentUser.email = email || currentUser.email;
    currentUser.username = username || currentUser.username;
    currentUser.profilePic = profilePic || currentUser.profilePic;
    currentUser.bio = bio || currentUser.bio;

    currentUser = await currentUser.save();

    // for not passing the password
    currentUser.password = null;

    res.status(200).json({ currentUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in updateUser: ", error.message);
  }
};
