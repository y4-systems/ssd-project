const mongoose = require("mongoose");
const Service = require("../models/serviceSchema");
const Couple = require("../models/coupleSchema");

// ======================== CREATE ========================
const serviceCreate = async (req, res) => {
  try {
    const service = new Service(req.body);
    const result = await service.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ======================== READ ========================
const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate("vendor", "shopName");
    res.send(services.length > 0 ? services : { message: "No services found" });
  } catch (err) {
    res.status(500).json(err);
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
    res.status(500).json(err);
  }
};

const getServiceDetail = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }

    const service = await Service.findById(req.params.id)
      .populate("vendor", "shopName")
      .populate({
        path: "reviews.reviewer",
        model: "couple",
        select: "name"
      });

    res.send(service ? service : { message: "No service found" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ======================== UPDATE ========================
const updateService = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }

    const result = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.send(result);
  } catch (error) {
    res.status(500).json(error);
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
        message: "You have already submitted a review for this service."
      });
    }

    service.reviews.push({
      rating,
      comment,
      reviewer,
      date: new Date()
    });

    const updatedService = await service.save();
    res.send(updatedService);
  } catch (error) {
    res.status(500).json(error);
  }
};

// ======================== SEARCH ========================
const searchService = async (req, res) => {
  try {
    const key = req.params.key;
    const services = await Service.find({
      $or: [
        { serviceName: { $regex: key, $options: "i" } },
        { category: { $regex: key, $options: "i" } },
        { subcategory: { $regex: key, $options: "i" } }
      ]
    }).populate("vendor", "shopName");

    res.send(services.length > 0 ? services : { message: "No services found" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const searchServicebyCategory = async (req, res) => {
  try {
    const key = req.params.key;
    const services = await Service.find({
      category: { $regex: key, $options: "i" }
    }).populate("vendor", "shopName");

    res.send(services.length > 0 ? services : { message: "No services found" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const searchServicebySubCategory = async (req, res) => {
  try {
    const key = req.params.key;
    const services = await Service.find({
      subcategory: { $regex: key, $options: "i" }
    }).populate("vendor", "shopName");

    res.send(services.length > 0 ? services : { message: "No services found" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ======================== DELETE ========================
const deleteService = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }

    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (deletedService) {
      await Couple.updateMany(
        { "invoiceDetails._id": deletedService._id },
        { $pull: { invoiceDetails: { _id: deletedService._id } } }
      );
    }

    res.send(deletedService);
  } catch (error) {
    res.status(500).json(error);
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

    const deletedServices = await Service.find({ vendor: vendorId });
    await Couple.updateMany(
      { "invoiceDetails._id": { $in: deletedServices.map((s) => s._id) } },
      {
        $pull: {
          invoiceDetails: { _id: { $in: deletedServices.map((s) => s._id) } }
        }
      }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
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
    res.status(500).json(error);
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
    res.status(500).json(error);
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
      "invoiceDetails._id": serviceId
    });

    const coupleDetails = interestedCouples
      .map((couple) => {
        const invoiceItem = couple.invoiceDetails.find(
          (item) => item._id.toString() === serviceId.toString()
        );
        return invoiceItem
          ? {
              coupleName: couple.name,
              coupleID: couple._id,
              quantity: invoiceItem.quantity
            }
          : null;
      })
      .filter((item) => item !== null);

    res.send(
      coupleDetails.length > 0
        ? coupleDetails
        : { message: "No couples are interested in this service." }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAddedToInvoiceServices = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }

    const vendorId = new mongoose.Types.ObjectId(req.params.id);

    const couplesWithVendorService = await Couple.find({
      "invoiceDetails.vendor": vendorId
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
              serviceID: serviceId
            });
          }
        }
      });
    });

    res.send(
      serviceMap.size > 0
        ? Array.from(serviceMap.values())
        : {
            message:
              "No services from this vendor are added to invoice by couples."
          }
    );
  } catch (error) {
    res.status(500).json(error);
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
  getAddedToInvoiceServices
};
