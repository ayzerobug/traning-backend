import AppError from "../errors/AppError.js";
import prisma from "../prisma/client.js";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserResource } from "../resources/user-resource.js";

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("name, email and password are required", 400);
  }

  if (password.length < 6) {
    throw new AppError("password must be at least 6 characters", 400);
  }

  const userExist = await prisma.user.findFirst({ where: { email } });

  if (userExist) {
    throw new AppError("This email address has already be used.", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.status(201).json({
    message: "Your registration is completed",
    user: UserResource.toJSON(user),
    token,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("email and password are required", 400);
  }

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(
      "The credentials you entered doesn't exist in our system",
      401,
    );
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({
    message: "Login Successful",
    user: UserResource.toJSON(user),
    token,
  });
}

export default { register, login };
