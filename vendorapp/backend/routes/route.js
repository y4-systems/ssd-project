const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const rateLimit = require("express-rate-limit");

// Vendor Controller
const {
  vendorRegister,
  vendorLogIn
} = require("../controllers/vendorController.js");

// Service Controller
const {
  serviceCreate,
  getServices,
  getServiceDetail,
  searchService,
  searchServicebyCategory,
  searchServicebySubCategory,
  getVendorServices,
  updateService,
  deleteService,
  deleteServices,
  deleteServiceReview,
  deleteAllServiceReviews,
  addReview,
  getInterestedCouples,
  getAddedToInvoiceServices
} = require("../controllers/serviceController.js");

// Couple Controller
const {
  coupleRegister,
  coupleLogIn,
  getInvoiceDetail,
  invoiceUpdate
} = require("../controllers/coupleController.js");

// Booking Controller
const {
  newBooking,
  getBookingedServicesByCouple,
  getBookingedServicesByVendor
} = require("../controllers/bookingController.js");

// ====== Rate Limiters ======

// Strict limiter for login/register (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // max 5 attempts
  message: { error: "Too many attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

// Moderate limiter for sensitive write actions (create/update/delete)
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 actions per IP
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

// Lighter limiter for search/list endpoints (anti-scraping)
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: { error: "Too many search requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false
});

// ====== Routes ======

// Vendor
router.post("/VendorRegister", authLimiter, vendorRegister);
router.post("/VendorLogin", authLimiter, vendorLogIn);

// Service
router.post("/ServiceCreate", writeLimiter, serviceCreate);
router.get("/getVendorServices/:id", searchLimiter, getVendorServices);
router.get("/getServices", searchLimiter, getServices);
router.get("/getServiceDetail/:id", searchLimiter, getServiceDetail);
router.get("/getInterestedCouples/:id", searchLimiter, getInterestedCouples);
router.get(
  "/getAddedToInvoiceServices/:id",
  searchLimiter,
  getAddedToInvoiceServices
);

router.put("/ServiceUpdate/:id", writeLimiter, updateService);
router.put("/addReview/:id", writeLimiter, addReview);

router.get("/searchService/:key", searchLimiter, searchService);
router.get(
  "/searchServicebyCategory/:key",
  searchLimiter,
  searchServicebyCategory
);
router.get(
  "/searchServicebySubCategory/:key",
  searchLimiter,
  searchServicebySubCategory
);

router.delete("/DeleteService/:id", writeLimiter, deleteService);
router.delete("/DeleteServices/:id", writeLimiter, deleteServices);
router.put("/deleteServiceReview/:id", writeLimiter, deleteServiceReview);
router.delete(
  "/deleteAllServiceReviews/:id",
  writeLimiter,
  deleteAllServiceReviews
);

// Couple
router.post("/CoupleRegister", authLimiter, coupleRegister);
router.post("/CoupleLogin", authLimiter, coupleLogIn);

router.get("/getInvoiceDetail/:id", searchLimiter, getInvoiceDetail);
router.put("/CoupleUpdate/:id", writeLimiter, invoiceUpdate);

// Booking
router.post("/newBooking", writeLimiter, newBooking);
router.get(
  "/getBookingedServicesByCouple/:id",
  searchLimiter,
  getBookingedServicesByCouple
);
router.get(
  "/getBookingedServicesByVendor/:id",
  searchLimiter,
  getBookingedServicesByVendor
);

module.exports = router;
