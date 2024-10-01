import mongoose from "mongoose";

const threadSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    children: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Thread",
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  },
  {
    timestamps: true,
  }
);

const Thread = mongoose.model("Thread", threadSchema);

export default Thread;
