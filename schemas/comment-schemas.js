import { z } from "zod";

const commentSchema = z.object({
  body: z
    .string("body is required")
    .trim()
    .min(1, "body is required")
    .max(1000, "body must be under 1000 characters"),
});

export { commentSchema };
