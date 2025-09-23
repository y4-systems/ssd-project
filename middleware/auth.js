const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

/**
 * Authentication Middleware
 * Validates JWT tokens with proper security measures
 */
const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    // Extract token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
        code: "NO_TOKEN"
      });
    }

    // Verify JWT with strict algorithm specification
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: ["HS256"],
      issuer: "wedding-management-system",
      maxAge: "1h"
    });

    // Mock user validation (replace with DB lookup in prod)
    const user = await validateUser(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: "Invalid token. User not found.",
        code: "INVALID_USER"
      });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error(
      `[SECURITY] Authentication failed: ${error.message} from IP: ${req.ip}`
    );

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token has expired",
        code: "TOKEN_EXPIRED"
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        code: "INVALID_TOKEN"
      });
    }

    return res.status(500).json({
      error: "Authentication service error",
      code: "AUTH_SERVICE_ERROR"
    });
  }
};

/**
 * Role-Based Access Control Middleware
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }

    if (!Array.isArray(allowedRoles)) {
      allowedRoles = [allowedRoles];
    }

    const userRole = req.user.role || "user";
    if (!allowedRoles.includes(userRole)) {
      console.warn(
        `[SECURITY] Access denied for user ${req.user.id} (role: ${userRole}) 
         to endpoint requiring roles: ${allowedRoles.join(", ")}`
      );

      return res.status(403).json({
        error: "Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

/**
 * Resource Authorization Middleware
 */
const authorizeResource = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Authentication required",
          code: "AUTH_REQUIRED"
        });
      }

      const resourceId = req.params.id;
      const userId = req.user.id;

      // Admin users can access all resources
      if (req.user.role === "admin") {
        return next();
      }

      // Check resource ownership
      const hasAccess = await checkResourceAccess(
        resourceType,
        resourceId,
        userId
      );

      if (!hasAccess) {
        console.warn(
          `[SECURITY] Unauthorized access attempt by user ${userId} to ${resourceType} ${resourceId}`
        );

        return res.status(403).json({
          error: "Access denied to this resource",
          code: "RESOURCE_ACCESS_DENIED"
        });
      }

      next();
    } catch (error) {
      console.error(
        `[SECURITY] Resource authorization error: ${error.message}`
      );
      return res.status(500).json({
        error: "Authorization service error",
        code: "AUTHZ_SERVICE_ERROR"
      });
    }
  };
};

/**
 * Event Access Authorization
 */
const authorizeEventAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }

    const eventId = req.params.eventId || req.params.id;
    const userId = req.user.id;

    if (req.user.role === "admin") {
      return next();
    }

    const hasEventAccess = await checkEventAccess(eventId, userId);

    if (!hasEventAccess) {
      console.warn(
        `[SECURITY] Unauthorized event access attempt by user ${userId} to event ${eventId}`
      );

      return res.status(403).json({
        error: "Access denied to this event",
        code: "EVENT_ACCESS_DENIED"
      });
    }

    next();
  } catch (error) {
    console.error(`[SECURITY] Event authorization error: ${error.message}`);
    return res.status(500).json({
      error: "Event authorization service error",
      code: "EVENT_AUTHZ_ERROR"
    });
  }
};

/**
 * Authentication Rate Limiter
 */
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: "Too many authentication attempts",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    console.warn(
      `[SECURITY] Authentication rate limit exceeded for IP: ${req.ip}`
    );
    res.status(429).json({
      error: "Too many authentication attempts",
      code: "AUTH_RATE_LIMIT_EXCEEDED",
      retryAfter: 900
    });
  }
});

/**
 * Mock User Validation Function
 */
const validateUser = async (userId) => {
  try {
    const mockUsers = {
      admin: { id: "admin", role: "admin", username: "admin@system.com" },
      user123: { id: "user123", role: "user", username: "user@example.com" },
      organizer1: {
        id: "organizer1",
        role: "organizer",
        username: "organizer@example.com"
      }
    };

    return mockUsers[userId] || null;
  } catch (error) {
    console.error(`[SECURITY] User validation error: ${error.message}`);
    return null;
  }
};

/**
 * Mock Resource Access Check
 */
const checkResourceAccess = async (resourceType, resourceId, userId) => {
  try {
    switch (resourceType) {
      case "package":
      case "guest":
      case "service":
        return true; // mock: allow access
      default:
        return false;
    }
  } catch (error) {
    console.error(`[SECURITY] Resource access check error: ${error.message}`);
    return false;
  }
};

/**
 * Mock Event Access Check
 */
const checkEventAccess = async (eventId, userId) => {
  try {
    // Mock: allow all for demo
    return true;
  } catch (error) {
    console.error(`[SECURITY] Event access check error: ${error.message}`);
  }
  return false; // <-- moved outside so it's always reachable
};

module.exports = {
  authenticateUser,
  requireRole,
  authorizeResource,
  authorizeEventAccess,
  authRateLimit
};
