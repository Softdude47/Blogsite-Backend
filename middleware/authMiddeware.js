import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.userId).select("-password");
    } catch (error) {
      res.status(401);
      throw new Error("Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  next();
});

const isAuthor = asyncHandler(async (req, res, next) => {
  // compares logged in user with post's author
  const id = req.params.id;
  const post = await Post.findById(id);

  if (!(post.author == req.user.id)) {
    res.status(401);
    throw new Error("Not authorized, not author");
  }
  next()
})
export { isAuthor, isLoggedIn };
