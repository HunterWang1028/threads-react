import mongoose from "mongoose";
import Thread from "../models/threadModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createThread = async (req, res) => {
  try {
    const { author, text } = req.body;
    let { img } = req.body;

    if (!author || !text) {
      return res.status(400).json({ message: "author and text are required" });
    }

    const user = await User.findById(author);
    if (!user) res.status(404).json({ message: " user not found" });

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newThread = new Thread({ author, text, img });

    await newThread.save();

    // update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

    res.status(201).json(newThread);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

export const getThreadById = async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
    })
      .populate({
        path: "author", // Populate the author field with _id and username
        model: "User",
        select: "_id name username profilePic",
      })
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: "User",
            select: "_id name username parentId profilePic",
          },
          {
            path: "children", // Populate the children field within children
            model: "Thread",
            populate: {
              path: "author", // Populate the author field within nested children
              model: "User",
              select: "_id name username parentId profilePic",
            },
          },
        ],
      })
      .exec();

    if (!thread) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};

const fetchAllChildThreads = async (id) => {
  const childThreads = await Thread.find({ parentId: id });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
};

export const deleteThread = async (req, res) => {
  try {
    const { id } = req.params;
    const mainThread = await Thread.findById(id);
    if (!mainThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    if (mainThread.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    if (mainThread.img) {
      const imgId = mainThread.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds to update User model respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlikeThread = async (req, res) => {
  try {
    const { id: threadId } = req.params;
    const userId = req.user._id;

    const thread = await Thread.findById(threadId);

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const hasLikedThread = thread.likes.includes(userId);

    if (hasLikedThread) {
      // Unlike thread
      await Thread.updateOne({ _id: threadId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Thread unliked successfully" });
    } else {
      // Like thread
      thread.likes.push(userId);
      await thread.save();
      res.status(200).json({ message: "Thread liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const commentToThread = async (req, res) => {
  try {
    const { text } = req.body;
    const threadId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const commentThread = new Thread({
      text,
      author: userId,
      parentId: threadId,
    });

    // save the new thread
    const savedCommentThread = await commentThread.save();

    // update the original thread to include the new thread

    originalThread.children.push(savedCommentThread._id);

    // save the original thread
    await originalThread.save();

    res.status(200).json(commentThread);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const getFeedThreads = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;

    const feedThreads = await Thread.find({ author: { $in: following } })
      .find({ parentId: { $in: [null, undefined] } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "author",
        model: "User",
        select: "_id name username profilePic",
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: "User",
          select: "_id name parentId username profilePic",
        },
      });

    res.status(200).json(feedThreads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserThreads = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const threads = await Thread.find({ author: user._id })
      .find({ parentId: { $in: [null, undefined] } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "author",
        model: "User",
        select: "_id name username profilePic threads",
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: "User",
          select: "_id name parentId username profilePic threads",
        },
      });

    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
