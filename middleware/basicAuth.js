// Basic authentication middleware for applications without full user management
const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({
      error: "Authentication required",
      code: "NO_AUTH",
    });
  }

  try {
    const base64Credentials = authHeader.substring(6);
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");

    // Simple admin check (in production, use proper user management)
    if (username === "admin" && password === process.env.ADMIN_PASSWORD) {
      req.user = { role: "admin", username: "admin" };
      next();
    } else {
      return res.status(401).json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }
  } catch (error) {
    return res.status(401).json({
      error: "Invalid authorization header",
      code: "INVALID_AUTH_HEADER",
    });
  }
};

// Role-based authorization
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access required",
      code: "ADMIN_REQUIRED",
    });
  }
  next();
};

module.exports = {
  basicAuth,
  requireAdmin,
};
