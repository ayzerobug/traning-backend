import { users } from "../data/users.js";
import AppError from "../errors/AppError.js";
import pool from "../configs/db/index.js";

async function getAllUsers(req, res) {
  const query = "SELECT * FROM users ORDER BY created_at DESC";
  const { rows } = await pool.query(query);
  res.json({ message: "Request Successful", data: rows });
}

async function getSingleUser(req, res) {
  const userId = parseInt(req.params.id);
  const query = "SELECT * FROM users WHERE id = $1";
  const result = await pool.query(query, [userId]);

  if (result.rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const user = result.rows[0];

  res.json({ message: "Request Successful", data: user });
}

async function createUser(req, res) {
  const { name, email } = req.body;

  const query = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
  const result = await pool.query(query, [name, email]);

  const newUser = result.rows[0];

  res.status(201).json({ message: "User created successfully", data: newUser });
}

async function updateUser(req, res) {
  const userId = parseInt(req.params.id);

  const getQuery = "SELECT * FROM users WHERE id = $1";
  const getResult = await pool.query(getQuery, [userId]);

  if (getResult.rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const user = getResult.rows[0];

  const name = req.body.name ?? user.name;
  const email = req.body.email ?? user.email;

  const query =
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *";
  const result = await pool.query(query, [name, email, userId]);

  res.json({ message: "User updated successfully", data: result.rows[0] });
}

async function deleteUser(req, res) {
  const userId = parseInt(req.params.id);

  const query = "DELETE FROM users WHERE id = $1";
  await pool.query(query, [userId]);

  res.json({ message: "User deleted successfully" });
}

export default {
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
