import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema } from "../config/validation.js";
import { generateToken } from "../config/utils.js";
import cloudinary from "../config/cloudinary.js";

const register = async (req, res) => {
  const userInput = {
    fullName: req.body.fullName.trim(),
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password,
  };
  const { fullName, email, password } = userInput;
  const { error } = registerSchema.validate(userInput);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });
    generateToken(user._id, res);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const loginInput = {
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password,
  };
  const { email, password } = loginInput;
  const { error } = loginSchema.validate(loginInput);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res
        .status(400)
        .json({ success: false, message: "Profile picture is required" });
    }
    const userId = req.user._id;
    const uploadReponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadReponse.secure_url,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: {
        id: updateUser._id,
        fullName: updateUser.fullName,
        email: updateUser.email,
        profilePic: updateUser.profilePic,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export { register, login, logout, updateProfile, checkAuth };
