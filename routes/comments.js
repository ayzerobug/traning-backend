import express from "express";
import controller from "../controllers/comments-controller.js";
import { commentSchema } from "../schemas/comment-schemas.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.patch("/:id", validate(commentSchema), controller.updateComment);
router.delete("/:id", controller.deleteComment);

export default router;
