import express from "express";
import { isLoggedIn } from "../middleware/authMiddeware.js";
import { getUserInfo, login, logout, registerUser, updateUserInfo } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/auth", login)
userRouter.route("/logout").post(isLoggedIn, logout)
userRouter.get("/:id", getUserInfo)
userRouter.route("/").post(registerUser).put(isLoggedIn, updateUserInfo);

export default userRouter;