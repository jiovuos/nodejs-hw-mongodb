import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

const ACCESS_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return next(createHttpError(401, "Not authorized"));

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    req.user = payload;
    next();
  } catch {
    next(createHttpError(401, "Invalid token"));
  }
};
