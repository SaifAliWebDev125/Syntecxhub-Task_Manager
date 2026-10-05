import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken, setRefreshCookie } from "../utils/generateTokens.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user._id);
  setRefreshCookie(res, generateRefreshToken(user._id));

  res.status(201).json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const accessToken = generateAccessToken(user._id);
  setRefreshCookie(res, generateRefreshToken(user._id));

  res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// Issues a fresh access token using the httpOnly refresh cookie, so the
// frontend never has to ask the user to log in again mid-session.
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Refresh token invalid or expired" });
    res.json({ accessToken: generateAccessToken(decoded.id) });
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});
