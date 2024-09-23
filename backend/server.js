import express from "express";
import dotenv from "dotenv";
import connectToDB from "./db/connectDB.js";

dotenv.config();

connectToDB();
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`server started at http://localhost:${PORT}`)
);
