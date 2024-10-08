import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decode.userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
