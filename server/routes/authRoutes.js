import express from "express";
import {
  login,
  logout,
  forgetPass,
  signup,
  verifyEmail,
  resetPass,
  checkAuth,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const route = express.Router();

route.post("/login", login);

route.post("/logout", logout);

route.post("/forget-password", forgetPass);
route.post("/reset-password/:token", resetPass);

route.post("/signup", signup);
route.post("/verify-email", verifyEmail);
route.get("/check-auth", verifyToken, checkAuth);
export default route;
