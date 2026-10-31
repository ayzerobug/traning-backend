import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string("name is required")
    .min(2, "name must be at least 2 characters")
    .max(100, "name must be under 100 characters"),
  email: z.email("email must be a valid email address"),
  password: z
    .string("password is required")
    .min(6, "password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.email("email must be a valid email address"),
  password: z
    .string("password is required")
    .min(6, "password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.email("email must be a valid email address"),
});

const resetPasswordSchema = z.object({
  password: z
    .string("password is required")
    .min(6, "password must be at least 6 characters"),
  token: z.string("token is required").min(1),
});

export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
