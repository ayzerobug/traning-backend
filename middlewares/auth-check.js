export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const headerPaths = authHeader.split(" ");

  const token = headerPaths[1];

  if (token !== "mysecrettoken") {
    return res.status(403).json({ message: "Invalid token" });
  }

  next();
}
