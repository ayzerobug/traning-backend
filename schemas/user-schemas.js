import { z } from "zod";

const createUserSchema = z.object({
  name: z
    .string("name is required")
    .min(2, "name must be at least 2 characters")
    .max(100, "name must be under 100 characters"),
  email: z.email("email must be a valid email address"),
});

export { createUserSchema };
