import "dotenv/config";
import express from "express";
import { logger } from "./middlewares/logger.js";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import profileRouter from "./routes/profile.js";
import authRouter from "./routes/auth.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { requireAuth } from "./middlewares/auth-check.js";
import prisma from "./prisma/client.js";
import { UserResource } from "./resources/user-resource.js";
import { apiLimiter, authLimiter } from "./middlewares/rate-limiter.js";
import helmet from "helmet";
import cors from "cors";
import AppError from "./errors/AppError.js";
import sanitize from "./middlewares/mongo-sanitize.js";

const app = express();

// ── 1. Security headers ───────────────────────────
app.use(helmet());

// ── 2. CORS ───────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        const error = new AppError("Not allowed by CORS");
        callback(error, false);
      }
    },
    credentials: true,
  }),
);

// ── 3. Body parser ────────────────────────────────
app.use(express.json());

// ── 4. NoSQL injection protection ────────────────
app.use(sanitize);

// ── 5. Rate limiting ──────────────────────────────
app.use(apiLimiter);

// ── 6. Static uploads ─────────────────────────────
app.use("/uploads", express.static("uploads"));

// ── 7. Request Logger ─────────────────────────────
app.use(logger);

// ── 8. Routes ─────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

app.use("/auth", authLimiter, authRouter);

app.use("/posts", requireAuth, postsRouter);
app.use("/users", requireAuth, usersRouter);
app.use("/profile", requireAuth, profileRouter);

app.use("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  res.json({
    message: "Request Successful",
    data: UserResource.toJSON(user),
  });
});

// ── 9. Global error handler ───────────────────────
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
