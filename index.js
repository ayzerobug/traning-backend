import "dotenv/config";
import express from "express";
import { logger } from "./middlewares/logger.js";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

// Middleware - parse incoming JSON requests
app.use(express.json());
app.use(logger);

// Define routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

app.use("/posts", postsRouter);
app.use("/users", usersRouter);

// Error handling middleware
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
