import prisma from "../prisma/client.js";

async function getAllPosts(req, res) {
  const data = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json({ message: "Request Successful", data });
}

async function getSinglePost(req, res) {
  const id = parseInt(req.params.id);

  const data = await prisma.post.findUnique({ where: { id: id } });

  res.json({ message: "Request Successful", data });
}

async function createPost(req, res) {
  const { title, body } = req.body;

  const user = await prisma.user.findFirst({});

  const post = await prisma.post.create({
    data: { title, body, userId: user.id },
  });

  res.status(201).json({ message: "User created successfully", data: post });
}

async function updatePost(req, res) {
  const id = parseInt(req.params.id);
  const { title, body } = req.body;

  const post = await prisma.user.update({
    where: { id },
    data: { title, body },
  });

  res.json({ message: "User updated successfully", data: post });
}

async function deletePost(req, res) {
  const id = parseInt(req.params.id);
  await prisma.post.delete({ where: { id } });

  res.json({ message: "User deleted successfully" });
}

export default {
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
};
