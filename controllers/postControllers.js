import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import Users from "../models/userModel.js";
import pagination from "../utils/pagination.js";
import mongoose, { Types } from "mongoose";

//  @desc    retreives a single post
//  @route   GET /api/posts/:id
//  @access  public
const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  await post.populate("author", "_id firstName lastName email");

  res.json(post);
});

//  @desc    retreive posts
//  @route   GET /api/posts
//  @access  public
const getPosts = asyncHandler(async (req, res) => {
  // url parameters
  let { perPage, page, author } = req.query;
  page = parseInt(page) || 1;
  perPage = parseInt(perPage) || 10;

  // pagination
  let posts;
  if (author) {
    author = await Users.findById(author);
    posts = Post.find({ author });
  } else {
    posts = Post.find();
  }
  posts.populate("author", "_id firstName lastName email");
  posts = await pagination(posts, { page, perPage });
  res.json(posts);
});

//  @desc   creates new posts
//  @route  POST /api/posts/new
//  @acces  Private
const createPosts = asyncHandler(async (req, res) => {
  const { title, body } = req.body;
  const author = req.user;

  const post = await Post.create({ title, body, author });
  req.user.posts.push(post._id);
  req.user.save();

  await post.populate("author", "_id firstName lastName email");
  res.json(post);
});

//  @desc   update existing posts
//  @route  PUT /api/posts/:id
//  @acces  Private
const updatePosts = asyncHandler(async (req, res) => {
  const { title, body } = req.body;
  const { id } = req.params;

  // updating data
  const post = await Post.findById(id);
  post.title = title || post.title;
  post.body = body || post.body;

  post.save();
  await post.populate("author", "_id firstName lastName email");
  res.json(post);
});

//  @desc   delete existing posts
//  @route  DELETE /api/posts/id
//  @acces  Private
const deletePosts = asyncHandler(async (req, res) => {
  const id = new Types.ObjectId(req.params.id);
  const idx = req.user.posts.indexOf(id);

  await Post.findByIdAndDelete(id);
  req.user.posts.splice(idx, 1);
  req.user.save();

  res.json({ message: "Deleted" });
});

export { getPost, getPosts, createPosts, updatePosts, deletePosts };
