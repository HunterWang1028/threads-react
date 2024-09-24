import express from "express";
import dotenv from "dotenv";
import connectToDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import threadRoutes from "./routes/threadRoutes.js";

dotenv.config();

connectToDB();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON data in req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/threads", threadRoutes);

app.listen(PORT, () =>
  console.log(`server started at http://localhost:${PORT}`)
);
