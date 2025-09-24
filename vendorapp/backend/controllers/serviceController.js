const mongoose = require("mongoose");
const validator = require("validator");
const Service = require("../models/serviceSchema");
const Couple = require("../models/coupleSchema");

// Escape regex to prevent ReDoS and injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ======================== CREATE ========================
const serviceCreate = async (req, res) => {
  try {
    const service = new Service(req.body);
    const result = await service.save();
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================== READ ========================
const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate("vendor", "shopName");
    res.send(services.length > 0 ? services : { message: "No services found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVendorServices = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }

    const vendorId = new mongoose.Types.ObjectId(req.params.id);
    const services = await Service.find({ vendor: vendorId });

    res.send(services.length > 0 ? services : { message: "No services found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    res.send(service ? service : { message: "No service found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================== UPDATE ========================
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
      { new: true, runValidators: true }
    );

    res.send(result ? result : { message: "Service not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================== REVIEWS ========================
const addReview = async (req, res) => {
  try {
    const { rating, comment, reviewer } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }

    const serviceId = new mongoose.Types.ObjectId(req.params.id);
    const service = await Service.findById(serviceId);

    if (!service) return res.status(404).json({ message: "Service not found" });

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
    res.status(500).json({ error: error.message });
  }
};

// ======================== SEARCH ========================
const searchService = async (req, res) => {
  try {
    const key = req.params.key;

    if (!key || key.length > 100) {
      return res.status(400).json({ error: "Invalid search key" });
    }

    const safeKey = escapeRegex(validator.escape(key.trim()));

    const services = await Service.find({
      $or: [
        { serviceName: { $regex: escapedKey, $options: "i" } },
        { category: { $regex: escapedKey, $options: "i" } },
        { subcategory: { $regex: escapedKey, $options: "i" } },
      ],
    })
      .populate("vendor", "shopName")
      .limit(50);

    res.send(services.length > 0 ? services : { message: "No services found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      .limit(50);

    res.send(services.length > 0 ? services : { message: "No services found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchServicebySubCategory = async (req, res) => {
  try {
    const key = req.params.key;

    if (!key || key.length > 100) {
      return res.status(400).json({ error: "Invalid search key" });
    }

    const safeKey = escapeRegex(validator.escape(key.trim()));

    let services = await Service.find({
      $or: [{ subcategory: { $regex: escapedKey, $options: "i" } }],
    })
      .populate("vendor", "shopName")
      .limit(50);

    res.send(services.length > 0 ? services : { message: "No services found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================== DELETE ========================
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

    if (deletedService) {
      await Couple.updateMany(
        { "invoiceDetails._id": deletedService._id },
        { $pull: { invoiceDetails: { _id: deletedService._id } } }
      );
    }

    res.send(
      deletedService ? deletedService : { message: "Service not found" }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteServices = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }

    const vendorId = new mongoose.Types.ObjectId(req.params.id);
    const deletionResult = await Service.deleteMany({ vendor: vendorId });

    if (!deletionResult.deletedCount) {
      return res.json({ message: "No services found to delete" });
    }

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteServiceReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.reviews = service.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    const updatedService = await service.save();
    res.send(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAllServiceReviews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.reviews = [];
    const updatedService = await service.save();

    res.send(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================== INVOICE / COUPLES ========================
const getInterestedCouples = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }

    const serviceId = new mongoose.Types.ObjectId(req.params.id);
    const interestedCouples = await Couple.find({
      "invoiceDetails._id": serviceId,
    });

    const coupleDetails = interestedCouples
      .map((couple) => {
        const invoiceItem = couple.invoiceDetails.find(
          (item) => item._id.toString() === serviceId.toString()
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
      .filter((item) => item !== null);

    res.send(
      coupleDetails.length > 0
        ? coupleDetails
        : { message: "No couples are interested in this service." }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAddedToInvoiceServices = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }

    const vendorId = new mongoose.Types.ObjectId(req.params.id);

    const couplesWithVendorService = await Couple.find({
      "invoiceDetails.vendor": vendorId,
    });

    const serviceMap = new Map();
    couplesWithVendorService.forEach((couple) => {
      couple.invoiceDetails.forEach((invoiceItem) => {
        if (invoiceItem.vendor.toString() === vendorId.toString()) {
          const serviceId = invoiceItem._id.toString();
          if (serviceMap.has(serviceId)) {
            serviceMap.get(serviceId).quantity += invoiceItem.quantity;
          } else {
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
    res.status(500).json({ error: error.message });
  }
};

// ======================== EXPORT ========================
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
