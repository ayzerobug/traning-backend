import AppError from "../errors/AppError.js";
import prisma from "../prisma/client.js";
import { CommentResource } from "../resources/comment-resource.js";
import xss from "xss";

async function getPostComments(req, res) {
  const postId = parseInt(req.params.postId);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: { user: true },
      skip,
      take: limit,
    }),
    prisma.comment.count({ where: { postId } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    message: "Request Successful",
    data: CommentResource.collection(comments),
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

async function createComment(req, res) {
  const postId = parseInt(req.params.postId);

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comment = await prisma.comment.create({
    data: {
      body: xss(req.body.body),
      postId,
      userId: req.user.id,
    },
    include: { user: true, post: true },
  });

  res.status(201).json({
    message: "Comment created successfully",
    data: CommentResource.toJSON(comment),
  });
}

async function updateComment(req, res) {
  const id = parseInt(req.params.id);

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.userId !== parseInt(req.user.id)) {
    throw new AppError("You are not authorized to edit this comment", 403);
  }

  const updated = await prisma.comment.update({
    where: { id },
    data: { body: xss(req.body.body) },
    include: { user: true },
  });

  res.json({
    message: "Comment updated successfully",
    data: CommentResource.toJSON(updated),
  });
}

async function deleteComment(req, res) {
  const id = parseInt(req.params.id);

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.userId !== parseInt(req.user.id)) {
    throw new AppError("You are not authorized to delete this comment", 403);
  }

  await prisma.comment.delete({ where: { id } });

  res.json({ message: "Comment deleted successfully" });
}

export default {
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
};
