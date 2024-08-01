import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";


connectDB();

const PORT = process.env.PORT || 5500;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.get("/", (req, res) => res.send("[INFO]: Server is running"));

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => console.log(`[INFO]: Server started at port ${PORT}`));
