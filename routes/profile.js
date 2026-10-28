import express from "express";
import controller from "../controllers/profile-controller.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/avatar", upload.single("avatar"), controller.uploadAvatar);

export default router;
