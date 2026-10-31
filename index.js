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

const app = express();

// Middleware - parse incoming JSON requests
app.use(express.json());
app.use(logger);

app.use(helmet());

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

app.use("/uploads", express.static("uploads"));

// Apply the general rate limiter to ALL routes
app.use(apiLimiter);

// Define routes
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

// Error handling middleware
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
