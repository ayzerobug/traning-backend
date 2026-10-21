import prisma from "../prisma/client.js";

async function getAllUsers(req, res) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json({ message: "Request Successful", data: users });
}

async function getSingleUser(req, res) {
  const userId = parseInt(req.params.id);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  res.json({ message: "Request Successful", data: user });
}

async function createUser(req, res) {
  const { name, email } = req.body;

  const user = await prisma.user.create({
    data: { name, email },
  });

  res.status(201).json({ message: "User created successfully", data: user });
}

async function updateUser(req, res) {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });

  res.json({ message: "User updated successfully", data: user });
}

async function deleteUser(req, res) {
  const userId = parseInt(req.params.id);
  await prisma.user.delete({ where: { id: userId } });

  res.json({ message: "User deleted successfully" });
}

export default {
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
