import { users } from "../data/users.js";
import AppError from "../errors/AppError.js";

export function validateUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new AppError("Name and email are required", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  next();
}
