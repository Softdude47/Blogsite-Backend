import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Add new user to database
// route    POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(500);
    throw new Error("User already exists");
  }
  
  const user = await User.create({ firstName, lastName, email, password });
  if (user) {
    const _id = user.id
    generateToken(res, _id);
    res.json({ _id, firstName, lastName, email });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user/set token
// route    POST /api/users/auth
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user.id);
    res.json({
      _id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
    });
  } else {
    res.status(400);
    throw new Error("invalid email or password");
  }
    
});

// @desc    Logout user/remove token
// route    POST /api/users/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  try {
    req.user = null;
    const token = req.cookies.jwt;
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
      maxAge: 1,
    });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    throw new Error(error.message)
  }
})

const updateUserInfo = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();
    res.json({
      _id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

// @desc    Gets user info
// route    POST /api/users/:id
// @access  Public
const getUserInfo = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById(_id)
  if (user) {
    res.json({
      _id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { registerUser, getUserInfo, login, logout, updateUserInfo };
