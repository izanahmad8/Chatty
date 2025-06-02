import express from "express";
import {
  checkAuth,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/authController.js";
import protectRoute from "../middleware/middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.put("/update-profile", protectRoute, updateProfile);

authRouter.get("/check", protectRoute, checkAuth);

export default authRouter;
