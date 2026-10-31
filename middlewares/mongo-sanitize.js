import mongoSanitize from "express-mongo-sanitize";

// express-mongo-sanitize assigns req.query, which is a read-only getter in Express 5
const sanitize = (req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  Object.defineProperty(req, "query", {
    value: mongoSanitize.sanitize({ ...req.query }),
    writable: true,
    configurable: true,
  });
  next();
};

export default sanitize;
