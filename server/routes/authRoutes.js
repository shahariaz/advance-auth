import express from "express";
import {
  login,
  logout,
  forgetPass,
  singup,
} from "../controllers/authController.js";
const route = express.Router();

route.post("/login", login);

route.post("/logout", logout);

route.post("/forget-password", forgetPass);

route.post("/signup", singup);

export default route;
