import jwt from "jsonwebtoken";
export const generateTokenAndSendCookies = (res, userID) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return token;
};
