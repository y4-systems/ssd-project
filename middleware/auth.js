const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust path as needed

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
    // Fallback to cookies
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        code: "NO_TOKEN",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: "User not found",
        code: "INVALID_USER",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "NO_AUTH",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        code: "INSUFFICIENT_ROLE",
        required: roles,
        current: req.user.role,
      });
    }

    next();
  };
};

// Resource ownership verification
const authorizeResource = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Authentication required",
          code: "NO_AUTH",
        });
      }

      const resourceId = req.params.id;
      let resource = null;

      switch (resourceType) {
        case "event":
          const Event = require("../models/eventSchema"); // Adjust path
          resource = await Event.findById(resourceId);
          break;

        case "guest":
          const Guest = require("../models/guestSchema"); // Adjust path
          const guest = await Guest.findById(resourceId).populate("event");
          if (guest && guest.event) {
            resource = { ownerId: guest.event.ownerId };
          }
          break;

        case "vendor":
          const Vendor = require("../models/vendorSchema"); // Adjust path
          resource = await Vendor.findById(resourceId);
          break;

        case "package":
          // For packages, only admin can modify
          if (req.user.role !== "admin") {
            return res.status(403).json({
              error: "Admin access required for package operations",
              code: "ADMIN_REQUIRED",
            });
          }
          return next();

        default:
          return res.status(400).json({
            error: "Unknown resource type",
            code: "UNKNOWN_RESOURCE",
          });
      }

      if (!resource) {
        return res.status(404).json({
          error: `${resourceType} not found`,
          code: "RESOURCE_NOT_FOUND",
        });
      }

      // Check ownership (admin can access everything)
      if (
        req.user.role === "admin" ||
        resource.ownerId.toString() === req.user.id ||
        resource.userId?.toString() === req.user.id
      ) {
        return next();
      }

      return res.status(403).json({
        error: "Access denied to this resource",
        code: "ACCESS_DENIED",
      });
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({
        error: "Authorization check failed",
        code: "AUTH_ERROR",
      });
    }
  };
};

// Event-specific authorization (for guest/vendor operations)
const authorizeEventAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "NO_AUTH",
      });
    }

    const eventId = req.params.eventId || req.params.id;

    if (!eventId) {
      return res.status(400).json({
        error: "Event ID required",
        code: "NO_EVENT_ID",
      });
    }

    // Validate event ID format
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        error: "Invalid event ID format",
        code: "INVALID_EVENT_ID",
      });
    }

    // Get event and check ownership
    const Event = require("../models/eventSchema"); // Adjust path
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
        code: "EVENT_NOT_FOUND",
      });
    }

    // Admin can access all, owner can access their events
    if (req.user.role === "admin" || event.ownerId.toString() === req.user.id) {
      req.event = event; // Attach event to request
      return next();
    }

    return res.status(403).json({
      error: "Access denied to this event",
      code: "EVENT_ACCESS_DENIED",
    });
  } catch (error) {
    console.error("Event authorization error:", error);
    return res.status(500).json({
      error: "Event authorization failed",
      code: "EVENT_AUTH_ERROR",
    });
  }
};

module.exports = {
  authenticateUser,
  requireRole,
  authorizeResource,
  authorizeEventAccess,
};
