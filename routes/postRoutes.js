import express from "express";
import {
  createPosts,
  deletePosts,
  getPost,
  getPosts,
  updatePosts,
} from "../controllers/postControllers.js";
import { isAuthor, isLoggedIn } from "../middleware/authMiddeware.js";

const postRouter = express.Router();

postRouter.route("/").get(getPosts).post(isLoggedIn, createPosts);
postRouter
  .route("/:id")
  .get(getPost)
  .put([isLoggedIn, isAuthor], updatePosts)
  .delete([isLoggedIn, isAuthor], deletePosts);

export default postRouter;
