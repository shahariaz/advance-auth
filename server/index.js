import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
dotenv.config();
import { connectDB } from "./db/connectDB.js";
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "GET request to / endpoint." });
});

//middleware
app.use(express.json());
app.use(cookieParser());
//router

app.use("/api/auth", authRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  connectDB();
  console.log("Server is running on port", port);
});
