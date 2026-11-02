import express from "express";
import controller from "../controllers/posts-controller.js";
import commentsController from "../controllers/comments-controller.js";
import { commentSchema } from "../schemas/comment-schemas.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", controller.getAllPosts);
router.get("/:id", controller.getSinglePost);
router.post("/", controller.createPost);
router.patch("/:id", controller.updatePost);
router.delete("/:id", controller.deletePost);
router.get("/:postId/comments", commentsController.getPostComments);
router.post(
  "/:postId/comments",
  validate(commentSchema),
  commentsController.createComment,
);

export default router;
