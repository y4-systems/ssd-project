const Service = require("../models/serviceSchema");
const Couple = require("../models/coupleSchema");

const serviceCreate = async (req, res) => {
    try {
        const service = new Service(req.body)

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
        let services = await Service.find({ vendor: req.params.id })
        if (services.length > 0) {
            res.send(services)
        } else {
            res.send({ message: "No services found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getServiceDetail = async (req, res) => {
    try {
        let service = await Service.findById(req.params.id)
            .populate("vendor", "shopName")
            .populate({
                path: "reviews.reviewer",
                model: "couple",
                select: "name"
            });

        if (service) {
            res.send(service);
        }
        else {
            res.send({ message: "No service found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateService = async (req, res) => {
    try {
        let result = await Service.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const addReview = async (req, res) => {
    try {
        const { rating, comment, reviewer } = req.body;
        const serviceId = req.params.id;

        const service = await Service.findById(serviceId);

        const existingReview = service.reviews.find(review => review.reviewer.toString() === reviewer);

        if (existingReview) {
            return res.send({ message: "You have already submitted a review for this service." });
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

        let services = await Service.find({
            $or: [
                { serviceName: { $regex: key, $options: 'i' } },
                { category: { $regex: key, $options: 'i' } },
                { subcategory: { $regex: key, $options: 'i' } }
            ]
        }).populate("vendor", "shopName");

        if (services.length > 0) {
            res.send(services);
        } else {
            res.send({ message: "No services found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const searchServicebyCategory = async (req, res) => {
    try {
        const key = req.params.key;

        let services = await Service.find({
            $or: [
                { category: { $regex: key, $options: 'i' } },
            ]
        }).populate("vendor", "shopName");

        if (services.length > 0) {
            res.send(services);
        } else {
            res.send({ message: "No services found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const searchServicebySubCategory = async (req, res) => {
    try {
        const key = req.params.key;

        let services = await Service.find({
            $or: [
                { subcategory: { $regex: key, $options: 'i' } }
            ]
        }).populate("vendor", "shopName");

        if (services.length > 0) {
            res.send(services);
        } else {
            res.send({ message: "No services found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);

        await Couple.updateMany(
            { "invoiceDetails._id": deletedService._id },
            { $pull: { invoiceDetails: { _id: deletedService._id } } }
        );

        res.send(deletedService);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteServices = async (req, res) => {
    try {
        const deletionResult = await Service.deleteMany({ vendor: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No services found to delete" });
            return;
        }

        const deletedServices = await Service.find({ vendor: req.params.id });

        await Couple.updateMany(
            { "invoiceDetails._id": { $in: deletedServices.map(service => service._id) } },
            { $pull: { invoiceDetails: { _id: { $in: deletedServices.map(service => service._id) } } } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};


const deleteServiceReview = async (req, res) => {
    try {
        const { reviewId } = req.body;
        const serviceId = req.params.id;

        const service = await Service.findById(serviceId);

        const updatedReviews = service.reviews.filter(review => review._id != reviewId);

        service.reviews = updatedReviews;

        const updatedService = await service.save();

        res.send(updatedService);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteAllServiceReviews = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        service.reviews = [];

        const updatedService = await service.save();

        res.send(updatedService);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getInterestedCouples = async (req, res) => {
    try {
        const serviceId = req.params.id;

        const interestedCouples = await Couple.find({
            'invoiceDetails._id': serviceId
        });

        const coupleDetails = interestedCouples.map(couple => {
            const invoiceItem = couple.invoiceDetails.find(item => item._id.toString() === serviceId);
            if (invoiceItem) {
                return {
                    coupleName: couple.name,
                    coupleID: couple._id,
                    quantity: invoiceItem.quantity,
                };
            }
            return null; // If invoiceItem is not found in this couple's invoiceDetails
        }).filter(item => item !== null); // Remove null values from the result

        if (coupleDetails.length > 0) {
            res.send(coupleDetails);
        } else {
            res.send({ message: 'No couples are interested in this service.' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAddedToInvoiceServices = async (req, res) => {
    try {
        const vendorId = req.params.id;

        const couplesWithVendorService = await Couple.find({
            'invoiceDetails.vendor': vendorId
        });

        const serviceMap = new Map(); // Use a Map to aggregate services by ID
        couplesWithVendorService.forEach(couple => {
            couple.invoiceDetails.forEach(invoiceItem => {
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
            res.send({ message: 'No services from this vendor are added to invoice by couples.' });
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