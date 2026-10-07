const jwt = require("jsonwebtoken");

// مثل authMiddleware، بس إذا ماكو توكن (زائر) يكمل عادي بدون خطأ
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      req.user = undefined;
    }
  }
  next();
};

module.exports = optionalAuth;
