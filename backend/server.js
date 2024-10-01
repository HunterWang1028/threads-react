import express from "express";
import dotenv from "dotenv";
import connectToDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import threadRoutes from "./routes/threadRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

connectToDB();
const app = express();

const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

app.use(express.json({ limit: "50mb" })); // To parse JSON data in req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () =>
  console.log(`server started at http://localhost:${PORT}`)
);
