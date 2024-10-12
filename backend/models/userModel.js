import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      // required: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    threads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
