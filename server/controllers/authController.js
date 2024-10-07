import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSendCookies } from "../utils/generateTokenAndSendCookies.js";
import { sendVerificationEmail } from "../mailtrap/email.js";
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required." });
  }
  // Check if email already exists in the database
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    return res
      .status(400)
      .json({ message: "Email already exists. Please use a different one." });
  }
  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a verification Code
  const verificationToken = generateVerificationCode();
  // await sendVerificationEmail(user);
  await sendVerificationEmail(email, verificationToken);

  // Save the user to the database
  const user = new User({
    email,
    password: hashedPassword,
    name,
    verificationToken,
    verficationTokenExpiresAt: Date.now() + 60 * 60 * 1000,
  });
  await user.save();
  // jwt
  const token = generateTokenAndSendCookies(res, user._id);
  // Send verification email

  res.status(201).json({
    message: "User created successfully.",
    token,
    user: {
      ...user._doc,
      password: null, // remove password from response
    },
  });
};
export const login = async (req, res) => {};

export const forgetPass = async (req, res) => {};
export const logout = async (req, res) => {};
