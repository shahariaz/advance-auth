import express from "express";
import {
  login,
  logout,
  forgetPass,
  signup,
  verifyEmail,
} from "../controllers/authController.js";

const route = express.Router();

route.post("/login", login);

route.post("/logout", logout);

route.post("/forget-password", forgetPass);

route.post("/signup", signup);
route.post("/verify-email", verifyEmail);

export default route;
