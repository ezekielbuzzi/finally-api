const User = require("../models/User");
const generateToken = require("../util/generateToken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const AppError = require("../util/AppError");

exports.signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please enter email and password", 400));
  }

  // const userExists = await User.findOne({ email });

  // if (userExists) {
  //   console.log("Here");
  //   return next(new AppError("User already exists", 400));
  // }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (newUser) {
    res.status(201).json({
      status: "success",
      message: "User successfully created",
    });
  }
});

exports.signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Plase provide email and password"));
  }

  const user = await User.findOne({ email });

  if (!(user && (await bcrypt.compare(password, user.password)))) {
    return next(new AppError("Wrong email or password", 401));
  }

  res.status(200).json({
    status: "success",
    message: "User successfully logged in",
    token: generateToken(user._id),
  });
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    users,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  // if (!user) {
  //   return next(new AppError("User with such an id not found", 404));
  // }

  res.status(200).json({
    status: "success",
    user,
  });
});
