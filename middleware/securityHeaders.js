const helmet = require("helmet");

// Security headers configuration
const getSecurityHeaders = (environment = "development") => {
  const isProduction = environment === "production";

  return helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "fonts.googleapis.com",
          "cdnjs.cloudflare.com"
        ],
        fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:", "*.cloudinary.com"],
        scriptSrc: isProduction
          ? ["'self'"]
          : ["'self'", "'unsafe-eval'", "'unsafe-inline'"], // Relaxed for dev
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "*.cloudinary.com"],
        frameSrc: ["'none'"],
        connectSrc: [
          "'self'",
          "https://api.cloudinary.com",
          ...(isProduction
            ? ["https://your-api-domain.com"]
            : ["https://127.0.0.1:*", "ws://127.0.0.1:*"]) // dev: allow http/ws for local testing
        ],

        upgradeInsecureRequests: isProduction ? [] : undefined
      },
      reportOnly: !isProduction // Report-only mode in development
    },

    // HTTP Strict Transport Security (HSTS)
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true
    },

    // Prevent clickjacking
    frameguard: {
      action: "deny" // Completely deny embedding in frames
    },

    // Prevent MIME type sniffing
    noSniff: true,

    // XSS Protection (legacy but still useful)
    xssFilter: true,

    // Hide X-Powered-By header
    hidePoweredBy: true,

    // Referrer Policy
    referrerPolicy: {
      policy: ["same-origin"]
    },

    // Permissions Policy (Feature Policy)
    permittedCrossDomainPolicies: false,

    // Cross-Origin Embedder Policy
    crossOriginEmbedderPolicy: isProduction ? true : false,

    // Cross-Origin Opener Policy
    crossOriginOpenerPolicy: {
      policy: "same-origin"
    },

    // Cross-Origin Resource Policy
    crossOriginResourcePolicy: {
      policy: "same-origin"
    }
  });
};

// CORS configuration
const getCorsOptions = (environment = "development") => {
  const isProduction = environment === "production";

  return {
    origin: isProduction
      ? ["https://your-wedding-app.com", "https://admin.your-wedding-app.com"]
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          "http://localhost:8080"
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours cache for preflight
    optionsSuccessStatus: 200 // For legacy browser support
  };
};

// Rate limiting configuration
const getRateLimitOptions = () => ({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP",
    code: "RATE_LIMIT_EXCEEDED",
    retryAfter: "15 minutes"
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  // Skip rate limiting for admin users
  skip: (req) => {
    return req.user && req.user.role === "admin";
  }
});

// Security middleware setup
const setupSecurity = (app, environment = "development") => {
  // Security headers
  app.use(getSecurityHeaders(environment));

  // Disable Express fingerprinting
  app.disable("x-powered-by");

  // Trust proxy if behind load balancer/reverse proxy
  if (environment === "production") {
    app.set("trust proxy", 1);
  }

  // Content type validation
  app.use((req, res, next) => {
    if (
      req.method === "POST" ||
      req.method === "PUT" ||
      req.method === "PATCH"
    ) {
      const contentType = req.get("Content-Type");
      if (
        contentType &&
        !contentType.includes("application/json") &&
        !contentType.includes("multipart/form-data")
      ) {
        return res.status(415).json({
          error: "Unsupported Media Type",
          code: "UNSUPPORTED_CONTENT_TYPE",
          accepted: ["application/json", "multipart/form-data"]
        });
      }
    }
    next();
  });
};

// Session security configuration
const getSessionConfig = (environment = "development") => {
  const isProduction = environment === "production";

  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessionId", // Don't use default session name
    cookie: {
      httpOnly: true, // Prevent XSS access to cookies
      secure: isProduction, // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 minutes
      domain: isProduction ? ".your-wedding-app.com" : undefined
    },
    genid: () => {
      // Generate cryptographically secure session IDs
      return require("crypto").randomBytes(32).toString("hex");
    }
  };
};

module.exports = {
  getSecurityHeaders,
  getCorsOptions,
  getRateLimitOptions,
  setupSecurity,
  getSessionConfig
};
