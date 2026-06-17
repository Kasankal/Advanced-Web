// backend/src/middleware/auth.js

// Middleware to validate user session
exports.validateSession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login first.",
    });
  }
  next();
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login first.",
    });
  }

  if (req.session.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden. Admin access required.",
    });
  }

  next();
};

// Middleware to attach user info to request
exports.attachUserInfo = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.user = {
      userId: req.session.userId,
      username: req.session.username,
      email: req.session.email,
      role: req.session.role,
    };
  }
  next();
};
