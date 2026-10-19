import AppError from "../errors/AppError.js";
import pool from "../configs/db/index.js";

export async function validateUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new AppError("Name and email are required", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
  const result = await pool.query(query, [email]);

  if (result.rows.length > 0) {
    throw new AppError("User with this email already exists", 400);
  }

  next();
}
