import express from "express";
import { requireAuth } from "../middlewares/auth-check.js";
import { validateUser } from "../middlewares/validate-user.js";
import controller from "../controllers/users-controller.js";

const router = express.Router();

router.get("/", requireAuth, controller.getAllUsers);
router.get("/:id", controller.getSingleUser);
router.post("/", validateUser, controller.createUser);
router.patch("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

export default router;
