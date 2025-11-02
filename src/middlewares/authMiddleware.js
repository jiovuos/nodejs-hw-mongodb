import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { Session } from "../models/Session.js";

const ACCESS_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return next(createHttpError(401, "Not authorized"));

  const token = header.split(" ")[1];
  if (!token) return next(createHttpError(401, "Not authorized"));

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    if (!payload || !payload.userId) {
      return next(createHttpError(401, "Invalid token payload"));
    }

    const session = await Session.findOne({ userId: payload.userId });
    if (!session) {
      return next(createHttpError(401, "Session not found"));
    }

    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    return next(createHttpError(401, "Invalid token"));
  }
};
