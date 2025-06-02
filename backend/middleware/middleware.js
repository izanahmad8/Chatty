import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. No token." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default protectRoute;
