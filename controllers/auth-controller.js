import AppError from "../errors/AppError.js";
import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserResource } from "../resources/user-resource.js";
import { sendEmail } from "../utils/mailer.js";
import { welcomeEmailTemplate } from "../email-templates/welcome-email.js";
import { resetPasswordEmailTemplate } from "../email-templates/reset-password-email.js";
import crypto from "crypto";

async function register(req, res) {
  const { name, email, password } = req.body;

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

  sendEmail({
    to: user.email,
    title: `Welcome to Yangaplug Training, ${user.name}`,
    htmlBody: welcomeEmailTemplate(user.name),
  });

  res.status(201).json({
    message: "Your registration is completed",
    user: UserResource.toJSON(user),
    token,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.json({
      success: true,
      message: "If this email exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour;

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry: tokenExpiry },
  });

  const resetLink = `${process.env.APP_URL}/auth/reset-password?token=${resetToken}`;

  sendEmail({
    to: user.email,
    title: "Reset your Yangaplug Training Account.",
    htmlBody: resetPasswordEmailTemplate(user.name, resetLink),
  });

  return res.json({
    success: true,
    message: "If this email exists, a reset link has been sent.",
  });
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError("Reset token is invalid or expired", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  res.json({
    success: true,
    message: "Password reset successful, you can now login again.",
  });
};

export default { register, login, forgotPassword, resetPassword };
