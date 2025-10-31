import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "7d"
  });
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw createHttpError(409, "Email already in use");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    res.status(201).json({
      status: 201,
      message: "User registered successfully",
      data: { email: user.email }
    });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createHttpError(401, "Email or password is wrong");
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    await Session.create({ userId: user._id, refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      status: 200,
      message: "Login successful",
      data: { accessToken }
    });
  } catch (e) {
    next(e);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw createHttpError(401, "No refresh token");

    const session = await Session.findOne({ refreshToken: token });
    if (!session) throw createHttpError(403, "Invalid session");

    const { userId } = jwt.verify(token, REFRESH_SECRET);

    const { accessToken, refreshToken } = generateTokens(userId);

    session.refreshToken = refreshToken;
    await session.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      status: 200,
      message: "Token updated",
      data: { accessToken }
    });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await Session.findOneAndDelete({ refreshToken: token });
    }

    res.clearCookie("refreshToken");

    res.json({
      status: 200,
      message: "Logout successful",
      data: null
    });
  } catch (e) {
    next(e);
  }
};
