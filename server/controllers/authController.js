import { User } from "../models/User.js";
export const singup = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required." });
  }
  // Check if email already exists in the database
  const userAlreadyExists = await User.findOne({ email });
};
export const login = async (req, res) => {};

export const forgetPass = async (req, res) => {};
export const logout = async (req, res) => {};
