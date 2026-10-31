import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 60, // max of 60 request
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many request, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max of 10 request
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many request, please try again later.",
  },
});

export { apiLimiter, authLimiter };
