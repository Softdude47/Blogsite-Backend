import express from "express";
import { createPosts, deletePosts, getPosts, updatePosts } from "../controllers/postControllers.js";
import { isAuthor, isLoggedIn } from "../middleware/authMiddeware.js";

const postRouter = express.Router();

postRouter.get("/", getPosts);
postRouter.route("/:id").put([isLoggedIn, isAuthor], updatePosts).delete([isLoggedIn, isAuthor], deletePosts)
postRouter.route("/new").post(isLoggedIn, createPosts);
postRouter.delete("/delete", (req, res) => res.send("Hello World"));


export default postRouter;