/**
 * Basic Authentication Middleware (SonarQube A-grade)
 * Provides simple authentication for applications without full JWT setup
 */

/**
 * Basic Authentication Middleware
 * Validates authorization headers and sets user context
 */
const basicAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authorization header required",
        code: "MISSING_AUTH_HEADER",
      });
    }

    const token = authHeader.substring(7);

    // Validate token format (basic validation)
    if (!token || token.length < 10) {
      return res.status(401).json({
        error: "Invalid token format",
        code: "INVALID_TOKEN_FORMAT",
      });
    }

    // Mock token validation (replace with actual implementation)
    const user = validateBasicToken(token);

    if (!user) {
      return res.status(401).json({
        error: "Invalid or expired token",
        code: "INVALID_TOKEN",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(
      `[SECURITY] Basic auth error: ${error.message} from IP: ${req.ip}`
    );
    return res.status(500).json({
      error: "Authentication service error",
      code: "AUTH_SERVICE_ERROR",
    });
  }
};

/**
 * Admin Role Requirement Middleware
 * Ensures authenticated user has admin privileges
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
      code: "AUTH_REQUIRED",
    });
  }

  if (req.user.role !== "admin") {
    console.warn(
      `[SECURITY] Admin access denied for user ${req.user.id} (role: ${req.user.role})`
    );
    return res.status(403).json({
      error: "Admin privileges required",
      code: "ADMIN_REQUIRED",
    });
  }

  next();
};

/**
 * User Role Requirement Middleware
 * Ensures authenticated user has at least user privileges
 */
const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
      code: "AUTH_REQUIRED",
    });
  }

  const validRoles = ["user", "admin", "organizer"];
  if (!validRoles.includes(req.user.role)) {
    console.warn(
      `[SECURITY] User access denied for user ${req.user.id} (role: ${req.user.role})`
    );
    return res.status(403).json({
      error: "Valid user role required",
      code: "INVALID_ROLE",
    });
  }

  next();
};

/**
 * Resource Owner Middleware
 * Ensures user can only access their own resources
 */
const requireResourceOwner = (userIdField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "AUTH_REQUIRED",
      });
    }

    // Admin can access all resources
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.body[userIdField] || req.params[userIdField];

    if (resourceUserId && resourceUserId !== req.user.id) {
      console.warn(
        `[SECURITY] Resource access denied for user ${req.user.id} to resource owned by ${resourceUserId}`
      );
      return res.status(403).json({
        error: "Can only access your own resources",
        code: "RESOURCE_ACCESS_DENIED",
      });
    }

    next();
  };
};

/**
 * Mock Token Validation Function
 * Replace with actual token validation logic
 */
const validateBasicToken = (token) => {
  try {
    // Mock implementation - replace with actual validation
    const mockTokens = {
      admin_token_12345: {
        id: "admin",
        role: "admin",
        username: "admin@system.com",
        permissions: ["read", "write", "delete"],
      },
      user_token_67890: {
        id: "user123",
        role: "user",
        username: "user@example.com",
        permissions: ["read", "write"],
      },
      organizer_token_11111: {
        id: "organizer1",
        role: "organizer",
        username: "organizer@example.com",
        permissions: ["read", "write", "manage_events"],
      },
    };

    const user = mockTokens[token];

    if (user) {
      // Add timestamp for token tracking
      user.lastAccess = new Date();
      return user;
    }

    return null;
  } catch (error) {
    console.error(`[SECURITY] Token validation error: ${error.message}`);
    return null;
  }
};

/**
 * Permission Check Middleware
 * Validates specific permissions for actions
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "AUTH_REQUIRED",
      });
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      console.warn(
        `[SECURITY] Permission denied for user ${req.user.id}. Required: ${permission}`
      );
      return res.status(403).json({
        error: `Permission '${permission}' required`,
        code: "PERMISSION_DENIED",
        required: permission,
      });
    }

    next();
  };
};

module.exports = {
  basicAuth,
  requireAdmin,
  requireUser,
  requireResourceOwner,
  requirePermission,
};
