import { User } from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSendCookies } from "../utils/generateTokenAndSendCookies.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/email.js";
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
export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: verificationToken,
      verficationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    await sendWelcomeEmail(user.email);
    user.isVerified = true;
    user.verificationToken = null;
    user.verficationTokenExpiresAt = null;
    await user.save();
    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {}
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = generateTokenAndSendCookies(res, user._id);
  user.lastLogin = new Date();
  await user.save();
  res.status(200).json({
    message: "Logged in successfully.",
    token,
    user: {
      ...user._doc,
      password: null, // remove password from response
    },
  });
};
export const forgetPass = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log(resetToken);
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiresAt;
    await user.save();
    // sending a email
    const resetTokenUrl = `${process.env.CLIENT}:${process.env.PORT}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetTokenUrl);

    res.status(200).json({ message: "Password reset link sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
export const resetPass = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required." });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    //sending mail
    await sendSuccessMail(user.email);
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {}
};
