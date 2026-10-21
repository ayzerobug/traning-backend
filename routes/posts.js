import express from "express";
import controller from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", controller.getAllPosts);
router.get("/:id", controller.getSinglePost);
router.post("/", controller.createPost);
router.patch("/:id", controller.updatePost);
router.delete("/:id", controller.deletePost);

export default router;
