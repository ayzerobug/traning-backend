import { users } from "../data/users.js";
import AppError from "../errors/AppError.js";

function getAllUsers(req, res) {
  res.json({ message: "Request Successful", data: users });
}

function getSingleUser(req, res) {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);

  if (user === undefined) {
    throw new AppError("User not found", 404);
  }

  res.json({ message: "Request Successful", data: user });
}

function createUser(req, res) {
  const { name, email } = req.body;

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);

  res.status(201).json({ message: "User created successfully", data: newUser });
}

function updateUser(req, res) {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { name, email } = req.body;

  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }

  res.json({ message: "User updated successfully", data: user });
}

function deleteUser(req, res) {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new AppError("User not found", 404);
  }

  users.splice(userIndex, 1);

  res.json({ message: "User deleted successfully" });
}

export default {
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
