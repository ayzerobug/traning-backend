import express from "express";
import controller from "../controllers/users-controller.js";
import { createUserSchema } from "../schemas/user-schemas.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getSingleUser);
router.post("/", validate(createUserSchema), controller.createUser);
router.patch("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

export default router;
