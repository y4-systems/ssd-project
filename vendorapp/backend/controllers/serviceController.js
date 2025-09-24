const Service = require("../models/serviceSchema");
const Couple = require("../models/coupleSchema");
const mongoose = require("mongoose");
const {
  validateObjectId,
  sanitizeSearchQuery,
} = require("../../../middleware/security.js");

const serviceCreate = async (req, res) => {
  try {
    const service = new Service(req.body);

    let result = await service.save();

    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getServices = async (req, res) => {
  try {
    let services = await Service.find().populate("vendor", "shopName");
    if (services.length > 0) {
      res.send(services);
    } else {
      res.send({ message: "No services found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getVendorServices = async (req, res) => {
  try {
    // Validate ObjectId to prevent NoSQL injection
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "Invalid vendor ID format",
        code: "INVALID_OBJECT_ID",
      });
    }

    // Convert to ObjectId for type safety
    const vendorId = mongoose.Types.ObjectId(req.params.id);

    let services = await Service.find({ vendor: vendorId });
    if (services.length > 0) {
      res.send(services);
    } else {
      res.send({ message: "No services found" });
    }
  } catch (err) {
    console.error("Service retrieval error:", err.message);
    res.status(500).json({
      error: "Failed to retrieve services",
      code: "SERVICE_RETRIEVAL_ERROR",
    });
  }
};

const getServiceDetail = async (req, res) => {
  try {
    // ✅ DIRECT NoSQL INJECTION PROTECTION
    const id = req.params.id;

    // Comprehensive ObjectId validation to prevent NoSQL injection
    if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: "Invalid service ID format",
        code: "INVALID_OBJECT_ID",
      });
    }

    let service = await Service.findById(id)
      .populate("vendor", "shopName")
      .populate({
        path: "reviews.reviewer",
        model: "couple",
        select: "name",
      });

    if (service) {
      res.send(service);
    } else {
      res.status(404).json({
        error: "Service not found",
        code: "SERVICE_NOT_FOUND",
      });
    }
  } catch (err) {
    console.error("Service detail retrieval error:", err.message);
    res.status(500).json({
      error: "Failed to retrieve service details",
      code: "SERVICE_DETAIL_ERROR",
    });
  }
};

const updateService = async (req, res) => {
  try {
    // ✅ DIRECT NoSQL INJECTION PROTECTION
    const id = req.params.id;

    // Comprehensive ObjectId validation to prevent NoSQL injection
    if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: "Invalid service ID format",
        code: "INVALID_OBJECT_ID",
      });
    }

    let result = await Service.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (result) {
      res.send(result);
    } else {
      res.status(404).json({
        error: "Service not found",
        code: "SERVICE_NOT_FOUND",
      });
    }
  } catch (error) {
    console.error("Service update error:", error.message);
    res.status(500).json({
      error: "Failed to update service",
      code: "SERVICE_UPDATE_ERROR",
    });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment, reviewer } = req.body;
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);

    const existingReview = service.reviews.find(
      (review) => review.reviewer.toString() === reviewer
    );

    if (existingReview) {
      return res.send({
        message: "You have already submitted a review for this service.",
      });
    }

    service.reviews.push({
      rating,
      comment,
      reviewer,
      date: new Date(),
    });

    const updatedService = await service.save();

    res.send(updatedService);
  } catch (error) {
    res.status(500).json(error);
  }
};

const searchService = async (req, res) => {
  try {
    const key = req.params.key;

    // Validate search key to prevent ReDoS
    if (!key || key.length > 100) {
      return res.status(400).json({
        error: "Invalid search key (max 100 characters)",
        code: "INVALID_SEARCH_KEY",
      });
    }

    // Use safe pattern matching instead of direct regex
    const safePattern = /^[a-zA-Z0-9\s\-_.&]+$/;
    if (!safePattern.test(key)) {
      return res.status(400).json({
        error: "Search key contains invalid characters",
        code: "INVALID_SEARCH_CHARS",
      });
    }

    // Use MongoDB text search or safe regex with escaped input
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let services = await Service.find({
      $or: [
        { serviceName: { $regex: escapedKey, $options: "i" } },
        { category: { $regex: escapedKey, $options: "i" } },
        { subcategory: { $regex: escapedKey, $options: "i" } },
      ],
    })
      .populate("vendor", "shopName")
      .limit(50); // Limit results to prevent DoS

    if (services.length > 0) {
      res.send(services);
    } else {
      res.send({ message: "No services found" });
    }
  } catch (err) {
    console.error("Service search error:", err.message);
    res.status(500).json({
      error: "Search service failed",
      code: "SERVICE_SEARCH_ERROR",
    });
  }
};

const searchServicebyCategory = async (req, res) => {
  try {
    // ✅ DIRECT NoSQL INJECTION PROTECTION FOR SEARCH
    const key = req.params.key;

    // Comprehensive validation to prevent ReDoS and NoSQL injection
    if (!key || typeof key !== "string" || key.length > 100) {
      return res.status(400).json({
        error: "Invalid search key (max 100 characters)",
        code: "INVALID_SEARCH_KEY",
      });
    }

    // Use safe allowlist pattern to prevent ReDoS attacks
    const safePattern = /^[a-zA-Z0-9\s\-_.@]+$/;
    if (!safePattern.test(key)) {
      return res.status(400).json({
        error: "Search key contains invalid characters",
        code: "INVALID_SEARCH_CHARS",
      });
    }

    // Escape regex special characters to prevent injection
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let services = await Service.find({
      $or: [{ category: { $regex: escapedKey, $options: "i" } }],
    })
      .populate("vendor", "shopName")
      .limit(50); // Limit results to prevent DoS

    if (services.length > 0) {
      res.send(services);
    } else {
      res.send({ message: "No services found" });
    }
  } catch (err) {
    console.error("Category search error:", err.message);
    res.status(500).json({
      error: "Search failed",
      code: "CATEGORY_SEARCH_ERROR",
    });
  }
};

const searchServicebySubCategory = async (req, res) => {
  try {
    const key = req.params.key;

    // Validate search key to prevent ReDoS and NoSQL injection
    if (!key || key.length > 100) {
      return res.status(400).json({
        error: "Invalid search key (max 100 characters)",
        code: "INVALID_SEARCH_KEY",
      });
    }

    // Use safe pattern matching instead of direct regex
    const safePattern = /^[a-zA-Z0-9\s\-_.&]+$/;
    if (!safePattern.test(key)) {
      return res.status(400).json({
        error: "Search key contains invalid characters",
        code: "INVALID_SEARCH_CHARS",
      });
    }

    // Escape regex special characters to prevent injection
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let services = await Service.find({
      $or: [{ subcategory: { $regex: escapedKey, $options: "i" } }],
    })
      .populate("vendor", "shopName")
      .limit(50); // Limit results to prevent DoS

    if (services.length > 0) {
      res.send(services);
    } else {
      res.send({ message: "No services found" });
    }
  } catch (err) {
    console.error("Subcategory search error:", err.message);
    res.status(500).json({
      error: "Search failed",
      code: "SUBCATEGORY_SEARCH_ERROR",
    });
  }
};

const deleteService = async (req, res) => {
  try {
    // ✅ DIRECT NoSQL INJECTION PROTECTION
    const id = req.params.id;

    // Comprehensive ObjectId validation to prevent NoSQL injection
    if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: "Invalid service ID format",
        code: "INVALID_OBJECT_ID",
      });
    }

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        error: "Service not found",
        code: "SERVICE_NOT_FOUND",
      });
    }

    await Couple.updateMany(
      { "invoiceDetails._id": deletedService._id },
      { $pull: { invoiceDetails: { _id: deletedService._id } } }
    );

    res.send(deletedService);
  } catch (error) {
    console.error("Service deletion error:", error.message);
    res.status(500).json({
      error: "Failed to delete service",
      code: "SERVICE_DELETE_ERROR",
    });
  }
};

const deleteServices = async (req, res) => {
  try {
    // Validate ObjectId to prevent NoSQL injection
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "Invalid vendor ID format",
        code: "INVALID_OBJECT_ID",
      });
    }

    // Convert to ObjectId for type safety
    const vendorId = mongoose.Types.ObjectId(req.params.id);

    const deletionResult = await Service.deleteMany({ vendor: vendorId });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No services found to delete" });
      return;
    }

    const deletedServices = await Service.find({ vendor: vendorId });

    await Couple.updateMany(
      {
        "invoiceDetails._id": {
          $in: deletedServices.map((service) => service._id),
        },
      },
      {
        $pull: {
          invoiceDetails: {
            _id: { $in: deletedServices.map((service) => service._id) },
          },
        },
      }
    );

    res.send(deletionResult);
  } catch (error) {
    console.error("Services deletion error:", error.message);
    res.status(500).json({
      error: "Failed to delete services",
      code: "SERVICES_DELETE_ERROR",
    });
  }
};

const deleteServiceReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);

    const updatedReviews = service.reviews.filter(
      (review) => review._id != reviewId
    );

    service.reviews = updatedReviews;

    const updatedService = await service.save();

    res.send(updatedService);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteAllServiceReviews = async (req, res) => {
  try {
    // Validate ObjectId to prevent NoSQL injection
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "Invalid service ID format",
        code: "INVALID_OBJECT_ID",
      });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        error: "Service not found",
        code: "SERVICE_NOT_FOUND",
      });
    }

    service.reviews = [];

    const updatedService = await service.save();

    res.send(updatedService);
  } catch (error) {
    console.error("Delete reviews error:", error.message);
    res.status(500).json({
      error: "Failed to delete reviews",
      code: "DELETE_REVIEWS_ERROR",
    });
  }
};

const getInterestedCouples = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const interestedCouples = await Couple.find({
      "invoiceDetails._id": serviceId,
    });

    const coupleDetails = interestedCouples
      .map((couple) => {
        const invoiceItem = couple.invoiceDetails.find(
          (item) => item._id.toString() === serviceId
        );
        if (invoiceItem) {
          return {
            coupleName: couple.name,
            coupleID: couple._id,
            quantity: invoiceItem.quantity,
          };
        }
        return null; // If invoiceItem is not found in this couple's invoiceDetails
      })
      .filter((item) => item !== null); // Remove null values from the result

    if (coupleDetails.length > 0) {
      res.send(coupleDetails);
    } else {
      res.send({ message: "No couples are interested in this service." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAddedToInvoiceServices = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const couplesWithVendorService = await Couple.find({
      "invoiceDetails.vendor": vendorId,
    });

    const serviceMap = new Map(); // Use a Map to aggregate services by ID
    couplesWithVendorService.forEach((couple) => {
      couple.invoiceDetails.forEach((invoiceItem) => {
        if (invoiceItem.vendor.toString() === vendorId) {
          const serviceId = invoiceItem._id.toString();
          if (serviceMap.has(serviceId)) {
            // If service ID already exists, update the quantity
            const existingService = serviceMap.get(serviceId);
            existingService.quantity += invoiceItem.quantity;
          } else {
            // If service ID does not exist, add it to the Map
            serviceMap.set(serviceId, {
              serviceName: invoiceItem.serviceName,
              quantity: invoiceItem.quantity,
              category: invoiceItem.category,
              subcategory: invoiceItem.subcategory,
              serviceID: serviceId,
            });
          }
        }
      });
    });

    const servicesInInvoice = Array.from(serviceMap.values());

    if (servicesInInvoice.length > 0) {
      res.send(servicesInInvoice);
    } else {
      res.send({
        message:
          "No services from this vendor are added to invoice by couples.",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  serviceCreate,
  getServices,
  getVendorServices,
  getServiceDetail,
  updateService,
  addReview,
  searchService,
  searchServicebyCategory,
  searchServicebySubCategory,
  deleteService,
  deleteServices,
  deleteServiceReview,
  deleteAllServiceReviews,
  getInterestedCouples,
  getAddedToInvoiceServices,
};
