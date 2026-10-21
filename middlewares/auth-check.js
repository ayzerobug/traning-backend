import AppError from "../errors/AppError.js";
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const headers = req.headers;

  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No token provided. Please login.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    throw new AppError("Invalid token, please login again", 401);
  }
}
