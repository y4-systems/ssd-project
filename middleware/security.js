const mongoSanitize = require("express-mongo-sanitize");
const Joi = require("joi");
const mongoose = require("mongoose");

// MongoDB injection protection middleware
const preventNoSQLInjection = () => {
  return mongoSanitize({
    allowDots: true,
    replaceWith: "_",
  });
};

// Object ID validation middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid ID format",
      code: "INVALID_OBJECT_ID",
    });
  }

  next();
};

// General input validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        code: "VALIDATION_ERROR",
      });
    }
    next();
  };
};

// Search query sanitizer
const sanitizeSearchQuery = (req, res, next) => {
  if (req.query.search) {
    // Escape special regex characters
    req.query.search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Limit search length
    if (req.query.search.length > 100) {
      return res.status(400).json({
        error: "Search query too long",
        code: "SEARCH_TOO_LONG",
      });
    }
  }
  next();
};

// Validation schemas
const schemas = {
  // Guest validation
  guest: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .max(20),
    dietary: Joi.string().max(100),
    eventId: Joi.string().required(),
  }),

  // Package validation
  package: Joi.object({
    PackageName: Joi.string().min(3).max(100).required(),
    PackageDescription: Joi.string().min(10).max(500).required(),
    category: Joi.string()
      .valid("Standard Package", "Promotion Package")
      .required(),
    packageprice: Joi.number().positive().integer().required(),
    imageurl: Joi.string().uri().required(),
  }),

  // Event validation
  event: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    location: Joi.string().min(5).max(200).required(),
    date: Joi.date().min("now").required(),
    capacity: Joi.number().integer().min(1).max(1000).required(),
  }),
};

module.exports = {
  preventNoSQLInjection,
  validateObjectId,
  validateInput,
  sanitizeSearchQuery,
  schemas,
};
