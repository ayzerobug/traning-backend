import AppError from "../errors/AppError.js";
import prisma from "../prisma/client.js";
import { PostResource } from "../resources/post-resource.js";

async function getAllPosts(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const userId = req.query.authorId ? Number(req.query.authorId) : undefined;
  const searchQuery = req.query.search || "";

  const skip = (page - 1) * limit;

  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { body: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: true },
    skip,
    take: limit,
  });

  const total = await prisma.post.count({ where });

  const totalPages = Math.ceil(total / limit);

  res.json({
    message: "Request Successful",
    data: PostResource.collection(posts),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}

async function getSinglePost(req, res) {
  const id = parseInt(req.params.id);

  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { user: true },
  });

  res.json({ message: "Request Successful", data: PostResource.toJSON(post) });
}

async function createPost(req, res) {
  const { title, body } = req.body;

  const post = await prisma.post.create({
    data: { title, body, userId: req.user.id },
  });

  res.status(201).json({ message: "User created successfully", data: post });
}

async function updatePost(req, res) {
  const id = parseInt(req.params.id);
  const { title, body } = req.body;

  const post = await prisma.post.findUnique({ where: { id } });

  if (post.userId !== parseInt(req.user.id)) {
    throw new AppError("You are not authorized to edit this post", 403);
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: { title, body },
    include: { user: true },
  });

  res.json({
    message: "User updated successfully",
    data: PostResource.toJSON(updatedPost),
  });
}

async function deletePost(req, res) {
  const id = parseInt(req.params.id);

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.userId !== parseInt(req.user.id)) {
    throw new AppError("You are not authorized to delete this post", 403);
  }

  await prisma.post.delete({ where: { id } });

  res.json({ message: "Post deleted successfully" });
}

export default {
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
};
